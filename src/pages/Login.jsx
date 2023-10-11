import api from "../api";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import sptechLogo from '../assets/images/sptech_logo.png';
import { injectStyle } from "react-toastify/dist/inject-style";

function Login() {

  injectStyle();

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post('/login', {
      email: username,
      senha: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 200 && response.data?.token) {
          sessionStorage.setItem('authToken', response.data.token);
          sessionStorage.setItem('usuario', response.data.nome);

          toast.success('Login realizado com sucesso!');
          navigate('/welcome');
        } else {
          throw new Error('Ops! Ocorreu um erro interno.');
        }
      })
      .catch(error => {
        toast.error(error.message);
      });
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={sptechLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Spring Security Test</h1>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
      </div>
      <div className="card">
        <p>
          Execute sua API de exemplo: <code> <a href="https://vitejs.dev" target="_blank"> https://github.com/BandTec/spring-security-jwt-exemplo </a></code>
        </p>
      </div>
    </>
  )
}

export default Login
