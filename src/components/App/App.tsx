import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../../services/movieService";
import { Toaster, toast } from "react-hot-toast";

// Импорт компонента пагинации
import ReactPaginate from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

// Импорт типов
import type { Movie } from "../../types/movie";
import type { TmdbResponse } from "../../services/movieService";
import appCss from "./App.module.css";

export default function App() {
  // 1. Стан для зберігання поточного пошукового запиту
  const [query, setQuery] = useState<string>("");

  // 2. Стан для поточної сторінки пагінації (начинаем с 1)
  const [page, setPage] = useState<number>(1);

  // 3. Стан для обраного фільму (для модального вікна)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // 4. ВИКОРИСТАННЯ useQuery ДЛЯ ОТРИМАННЯ ДАНИХ
  const { data, isLoading, isError, error } = useQuery<TmdbResponse>({
    // КЛЮЧ: Запрос выполняется повторно при изменении query ИЛИ page
    queryKey: ["movies", query, page],

    // ФУНКЦИЯ: Вызываем API с текущим запросом и страницей
    queryFn: () => fetchMovies(query, page),

    // Запрос выполняется, только если query не пустой
    enabled: !!query,

    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });

  // 5. Деструктуризація даних для рендерингу
  const movies: Movie[] = data?.results ?? [];
  const totalPages: number = data?.total_pages ?? 0;

  // 6. Функції для управління модальним вікном (без змін)
  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  // 7. Функція для обробки НОВОГО запиту
  const handleSearchSubmit = (newQuery: string) => {
    const trimmedQuery = newQuery.trim();

    if (!trimmedQuery) {
      toast.error("Please enter a search query.");
      return;
    }

    // При новом запросе сбрасываем страницу на 1, чтобы начать сначала
    if (trimmedQuery !== query) {
      setPage(1);
    }

    setQuery(trimmedQuery);
    setSelectedMovie(null);
  };

  // 8. Обработчик смены страницы для ReactPaginate
  const handlePageClick = ({ selected }: { selected: number }) => {
    // ReactPaginate передает 0-индексированный номер, API ожидает 1-индексированный
    const newPage = selected + 1;
    setPage(newPage);
    // Прокручиваем страницу вверх для лучшего UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={appCss.appRoot}>
      <SearchBar onSubmit={handleSearchSubmit} />
      <div>
        {/* Loader: показываем, если идет загрузка и запрос не пуст */}
        {isLoading && query && <Loader />}

        {/* Error: показываем, если произошла ошибка */}
        {isError && (
          <ErrorMessage
            message={
              error?.message || "An unexpected error occurred during search."
            }
          />
        )}

        {/* Успішний рендеринг: показываем, если есть фильмы и нет загрузки/ошибки */}
        {movies.length > 0 && !isLoading && !isError && (
          <>
            <div className={appCss.resultsMessage}>
              <p>
                Found {movies.length} movies.
                {totalPages > 0 &&
                  `Total pages: ${totalPages}. Current page: ${page}`}
              </p>
            </div>

            <MovieGrid movies={movies} onSelect={handleMovieSelect} />

            {/* РЕНДЕРИНГ ПАГИНАЦИИ: только если totalPages > 1 */}
            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={handlePageClick}
                // forcePage: синхронизирует активную кнопку с нашим состоянием 'page' (0-индексация)
                forcePage={page - 1}
                containerClassName={appCss.pagination}
                activeClassName={appCss.active}
                nextLabel="→"
                previousLabel="←"
                breakLabel="..."
                renderOnZeroPageCount={null}
              />
            )}
          </>
        )}

        {/* Сообщение об отсутствии результатов */}
        {!isLoading && !isError && movies.length === 0 && query && (
          <div className={appCss.resultsMessage}>
            <p>No movies found for your request: "{query}".</p>
          </div>
        )}

        {/* Начальное сообщение */}
        {!query && (
          <div className={appCss.resultsMessage}>
            <p>Enter a keyword to search for movies. </p>
          </div>
        )}
      </div>

      {/* Модальное окно */}
      {selectedMovie !== null && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}

      <Toaster position="top-right" />
    </div>
  );
}
