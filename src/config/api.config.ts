const isDev = import.meta.env.DEV;

export const BASE_URL = isDev
  ? "http://localhost:8080/api/v1"
  : (import.meta.env.VITE_API_URL || "https://english-test-generator-backend.vercel.app/api/v1");

export const AUTH_API = `${BASE_URL}/auth`;
export const QUIZ_API = `${BASE_URL}/quiz`;
export const ADMIN_QUIZZES_API = `${BASE_URL}/quiz`;
export const ADMIN_RESULTS_API = `${BASE_URL}/admin/results`;
export const USER_RESULTS_API = `${BASE_URL}/results`;
export const RESULTS_API = ADMIN_RESULTS_API;
export const USERS_API = `${BASE_URL}/admin/users`;
