import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { api } from '../../provider/api';

export function WelcomePage() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const username = sessionStorage?.getItem('usuario');

    const listarUsuarios = async () => {
        setLoading(true);
        const response = await api.get('/usuarios');
        setUsers(response.data);
        setLoading(false);
    }

    useEffect(() => {
        listarUsuarios();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('usuario');
        navigate('/');
    };

    return (
        <div>
            <div>
                <h1>Bem-vindo, {username}</h1>
                <p>Obrigado por entrar no sistema da São Paulo Tech School.</p>
            </div>



            <div className={styles['users-container']}>
                <h3>Usuários cadastrados</h3>

                {loading ? <p>Carregando...</p> : (
                    <>
                        <p>Total de usuários cadastrados: {users.length}</p>
                        <ul>
                            {users.map((user) => (
                                <li key={user.id}>{user.nome}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
            <button className={styles['logout-button']} onClick={handleLogout}>Logout</button>

        </div>
    );
}

