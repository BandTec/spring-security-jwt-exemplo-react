import axios from "axios";

// Criando uma instância do axios com a URL base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_ENDERECO_API, // http://localhost:8080/usuarios
})

// Adiciona o token JWT em todas as requisições
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export { api };