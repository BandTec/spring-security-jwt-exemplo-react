import { api } from "../../provider/api";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [aviso, setAviso] = useState({ mensagem: '', tipo: 'sucesso' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/usuarios/login', {
        email: username,
        senha: password
      });
      if (response.status === 200 && response.data?.token) {

        sessionStorage.setItem('authToken', response.data.token);

        setAviso({
          mensagem: 'Login realizado com sucesso!',
          tipo: 'sucesso'
        });

        setTimeout(() => {
          navigate('/welcome');
        }, 1000);
      } else {
        throw new Error('Ops! Ocorreu um erro interno.');
      }
    } catch (error) {
      setAviso({
        mensagem: error.status === 401 ? "Usuário ou senha inválidos" : 'Ops! Ocorreu um erro interno.',
        tipo: 'erro'
      });
    }
  };

  return (
    <>
      <main className={styles.container}>
        <div className={styles['logo-container']}>
          <a href="https://sptech.school" target="_blank">
            <img src={"/sptech_logo.png"} className={styles.logo} alt="Vite logo" />
          </a>
        </div>
        <h1>Spring Security Test</h1>
        <div className={styles['login-container']}>
          {aviso.mensagem && (
            <div
              className={`${styles.alert} ${aviso.tipo === 'sucesso' ? styles['alert-success'] : styles['alert-error']}`}
              role="status"
              aria-live="polite"
            >
              {aviso.mensagem}
            </div>
          )}
          <div>
            <h2>Login</h2>
            <h3>Acesse sua conta</h3>
          </div>
          <form onSubmit={handleSubmit}>

            <div className={styles['container-input']}>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className={styles['container-input']}>
              <label htmlFor="">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <button type="submit" className={styles['btn-login']}>Login</button>
          </form>
        </div>
        <div className={styles.card}>
          <p>
            Execute sua API de exemplo: <code> <a href="https://github.com/BandTec/spring-security-jwt-exemplo" target="_blank"> https://github.com/BandTec/spring-security-jwt-exemplo </a></code>
          </p>
        </div>
      </main>
    </>
  )
}


