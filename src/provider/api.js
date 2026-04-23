import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_ENDERECO_API ?? "http://localhost:8080",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("usuario");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export { api };
