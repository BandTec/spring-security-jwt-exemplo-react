import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/login/Login";
import { WelcomePage } from "./pages/welcome/WelcomePage";
import { PrivateRoute } from "./components/PrivateRoute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/welcome",
    // PrivateRoute verifica se há usuário na sessão antes de renderizar.
    // Se não houver, redireciona para "/" (login).
    element: (
      <PrivateRoute>
        <WelcomePage />
      </PrivateRoute>
    ),
  },
]);
