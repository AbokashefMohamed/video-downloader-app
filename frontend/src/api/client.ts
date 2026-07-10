import axios, { AxiosError } from "axios";
import { store } from "../store/index.ts";
import { logout } from "../store/authSlice.ts";
import { ApiError } from "../types/index.ts";

// all API calls go through this
if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is not defined.");
}
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// automatically attach JWT token to every outgoing request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// handle all res errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.code === "ERR_CANCELED") {
      return Promise.reject(new Error("Request canceled."));
    }

    if (!error.response) {
      return Promise.reject(
        new Error("Network error. Please check your connection."),
      );
    }
    const { status, data } = error.response;

    const token = store.getState().auth.token;

    if (status === 401 && token) {
      // token expired or invalid log user out automatically
      store.dispatch(logout());
      return Promise.reject(
        new Error(data?.message || "Session expired. Please login again."),
      );
    }

    if (status === 403) {
      // logged in but not allowed to do this
      return Promise.reject(
        new Error(data?.message || "You do not have permission to do this."),
      );
    }

    if (status === 422) {
        // pass full error
        return Promise.reject(error);
    }

    if (status === 429) {
      return Promise.reject(
        new Error(
          data?.message ||
            "Too many requests. Please wait before trying again.",
        ),
      );
    }

    if (status >= 400 && status < 500) {
      // client error
      return Promise.reject(
        new Error(data?.message || "Invalid request. Please check your input."),
      );
    }

    if (status >= 500) {
      // server error
      return Promise.reject(
        new Error(
          "Something went wrong on the server. Please try again later.",
        ),
      );
    }

    return Promise.reject(
      new Error(data?.message || "An unexpected error occurred."),
    );
  },
);

export default api;
