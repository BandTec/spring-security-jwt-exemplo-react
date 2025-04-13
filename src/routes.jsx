import React from "react";
import Login from "./pages/Login";
import WelcomePage from "./pages/WelcomePage";
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
