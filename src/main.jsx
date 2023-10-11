import React from 'react'
import ReactDOM from 'react-dom/client'

import Login from './Login.jsx'
import WelcomePage from './WelcomePage.jsx'

import { ToastContainer } from 'react-toastify';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import "react-toastify/dist/ReactToastify.minimal.css";

const router = createBrowserRouter([
  {
    path:'/',
    element: <Login />
  },
  {
    path: '/welcome',
    element: <WelcomePage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      limit={3}
    />
    {/* <Login /> */}
   <RouterProvider router={router} />
  </React.StrictMode>,
)
