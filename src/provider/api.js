import axios from "axios";

/**
 * Instância do Axios configurada para se comunicar com a API Spring Boot.
 *
 * ESTRATÉGIA DE AUTENTICAÇÃO: Cookie HttpOnly
 *
 * O token JWT é armazenado em um cookie HttpOnly pelo servidor no login.
 * O browser envia esse cookie automaticamente em cada requisição para a mesma
 * origem — não é necessário anexar o token manualmente via header.
 *
 * Por que isso é mais seguro do que sessionStorage/localStorage?
 *   - Cookies HttpOnly são INACESSÍVEIS ao JavaScript (document.cookie não os retorna)
 *   - Scripts maliciosos injetados por XSS não conseguem ler o token
 *   - sessionStorage e localStorage são acessíveis a qualquer JS na página
 *
 * ATENÇÃO: withCredentials: true é obrigatório para que o browser envie
 * os cookies em requisições cross-origin (frontend e API em portas diferentes).
 * No servidor, isso exige que o CORS defina origens explícitas (não "*").
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_ENDERECO_API ?? "http://localhost:8080",
  withCredentials: true, // envia cookies HttpOnly automaticamente
});

/**
 * Interceptor de RESPOSTA: trata erros de autenticação globalmente.
 *
 * Se o servidor retornar 401 (token expirado ou ausente), o usuário é
 * redirecionado para a tela de login e os dados da sessão são limpos.
 *
 * Isso substitui a necessidade de tratar 401 em cada componente individualmente.
 */
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
