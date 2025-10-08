import axios from "axios";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Проверка наличия обязательных переменных
if (!TMDB_API_KEY || !API_BASE_URL) {
  console.error(
    "Missing required environment variables (VITE_TMDB_API_KEY or VITE_API_BASE_URL)."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

export default api;
