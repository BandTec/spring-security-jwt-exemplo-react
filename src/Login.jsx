import { useState } from 'react'
import { toast } from 'react-toastify'
import sptechLogo from '/sptech_logo.png'
import { injectStyle } from "react-toastify/dist/inject-style";
import { useNavigate } from 'react-router-dom';


import './App.css'

function Login() {
  
  injectStyle();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: username, senha: password })
    })
      .then(response => {
        if (response.status !== 200) {
          throw new Error('Usuário ou senha inválidos.');
        }
        return response.json();
      })
      .then(data => {
        if (data.token) {
          sessionStorage.setItem('authToken', data.token);
          
          toast.success('Login realizado com sucesso!');
          
          navigate('/welcome', { state: { username: data.nome } });

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
          Execute sua API de exemplo: <code>https://github.com/BandTec/spring-security-jwt-exemplo</code>
        </p>
      </div>
    </>
  )
}

export default Login
