import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
  const usuario = sessionStorage.getItem("usuario");

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return children;
}
