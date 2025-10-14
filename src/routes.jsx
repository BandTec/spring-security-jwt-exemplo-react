import React from "react";
import { Login } from "./pages/login/Login";
import { WelcomePage } from "./pages/welcome/WelcomePage";
import { createBrowserRouter } from "react-router-dom";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/welcome",
    element: <WelcomePage />,
  },
]);
