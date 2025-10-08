import axios from "axios";
import { type Movie } from "../types/movie";
export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  runtime: number | null;
  genres: Genre[];
  tagline: string | null;
  backdrop_path: string | null;
}

// TmdbResponse - повна структура відповіді (потрібна для типізації запиту)
export interface TmdbResponse {
  page: number;
  results: Movie[];
  total_pages: number; // Включено для пагинации
  total_results: number;
}
// ----------------------------------------------------------------------

// Оголошуємо BASE_URL та змінну для Bearer Token
const BASE_URL = "https://api.themoviedb.org/3";
const VITE_TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function fetchMovies(
  searchQuery: string,
  page: number = 1
): Promise<TmdbResponse> {
  if (!searchQuery) {
    return {
      page: 0,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
  const response = await axios.get<TmdbResponse>(`${BASE_URL}/search/movie`, {
    params: {
      query: searchQuery,
      page: page,
      language: "en-US",
    },
    headers: {
      Authorization: `Bearer ${VITE_TMDB_API_KEY}`,
    },
  });

  return response.data; // Возвращаем весь объект TmdbResponse
}
