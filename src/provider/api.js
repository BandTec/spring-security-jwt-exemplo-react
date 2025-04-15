import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_ENDERECO_API, // http://localhost:8080/usuarios
  headers: {
    'Content-Type': 'application/json'
  }
})