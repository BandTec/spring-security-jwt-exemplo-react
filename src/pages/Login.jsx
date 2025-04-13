import { api } from "../provider/api";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sptechLogo from '../assets/images/sptech_logo.png';
import  Toast  from '../components/Toast';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso' });

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

          setToast({
            mensagem: 'Login realizado com sucesso!',
            tipo: 'sucesso'
          });

          setTimeout(() => {
            navigate('/welcome');
          }, 1000);
        } else {
          throw new Error('Ops! Ocorreu um erro interno.');
        }
      })
      .catch(error => {
        console.log(error.message);
        setToast({
          mensagem: error.message || 'Ops! Ocorreu um erro interno.',
          tipo: 'erro'
        });
      });
  };

  return (
    <>
      {toast.mensagem && (
        <Toast
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={() => setToast({ mensagem: '', tipo: 'sucesso' })}
        />
      )}

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
