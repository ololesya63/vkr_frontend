import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import './Header.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    // Проверяем, находимся ли на главной странице
    const isHomePage = location.pathname === '/';

    const handleNavClick = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleSearchClick = () => {
        navigate('/results');
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo" onClick={handleLogoClick}>
                    <span className="check-icon">✔</span>
                    <span className="logo-text">
                        <span className="logo-black">Честный</span>
                        <span className="logo-blue">Товар</span>
                    </span>
                </div>

                {/* Показываем навигацию только на главной странице */}
                {isHomePage && (
                    <>
                        <nav className="nav">
                            <ul className="nav-list">
                                <li>
                                    <button
                                        className="nav-link"
                                        onClick={() => handleNavClick('how-it-works')}
                                    >
                                        Как это работает
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="nav-link"
                                        onClick={() => handleNavClick('features')}
                                    >
                                        Преимущества
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="nav-link"
                                        onClick={() => handleNavClick('results')}
                                    >
                                        Пример результатов
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        <div className="header-right">
                            <button className="header-search-btn" onClick={handleSearchClick}>
                                Перейти к поиску
                            </button>
                        </div>
                    </>
                )}

                {/* На второй странице показываем только пустое место для баланса */}
                {!isHomePage && <div className="header-spacer"></div>}
            </div>
        </header>
    );
}

export default Header;