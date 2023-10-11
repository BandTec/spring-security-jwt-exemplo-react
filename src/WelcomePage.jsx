import { useNavigate, useLocation } from 'react-router-dom';

function WelcomePage() {

    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state?.username || 'Usuário';


    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div className="welcome-container">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <div className="welcome-content">
                <h1>Bem-vindo, {username}</h1>
                <p>Obrigado por entrar no sistema da São Paulo Tech School.</p>
            </div>
        </div>
    );
}

export default WelcomePage;
