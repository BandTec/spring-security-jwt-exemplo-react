import { Navigate } from "react-router-dom";

/**
 * Componente de proteção de rotas no lado do cliente.
 *
 * Verifica se existe um usuário na sessão antes de renderizar a rota.
 * Se não houver, redireciona para a tela de login.
 *
 * IMPORTANTE — Limitação do HttpOnly:
 * Como o token está em um cookie HttpOnly, o JavaScript não consegue lê-lo
 * diretamente. Por isso, usamos o nome do usuário em sessionStorage como
 * indicador de "está logado" para fins de UX (experiência do usuário).
 *
 * A segurança REAL é garantida pelo backend:
 *   - Toda requisição a endpoint protegido exige o cookie com token válido
 *   - Se alguém apagar o sessionStorage mas mantiver o cookie, o backend
 *     ainda autenticará — mas o PrivateRoute redirecionará para login
 *   - Se alguém falsificar o sessionStorage sem ter o cookie, o backend
 *     retornará 401 e o interceptor do Axios redirecionará para login
 *
 * Em resumo: PrivateRoute melhora a UX, mas o controle de acesso real
 * sempre acontece no servidor.
 */
export function PrivateRoute({ children }) {
  const usuario = sessionStorage.getItem("usuario");

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return children;
}
