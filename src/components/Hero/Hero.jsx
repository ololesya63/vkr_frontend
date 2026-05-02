import React from "react";
import SearchBar from "../SearchBar/SearchBar.jsx";
import "./Hero.css";
import wblogo from "../../assets/wb.jpg";
import ozonlogo from "../../assets/ozon.png";
import { useNavigate } from "react-router";

function Hero() {
    const navigate = useNavigate();

    const handleSearch = (query) => {
        navigate(`/results?query=${encodeURIComponent(query)}`);
    };

    return (
        <section className="hero">
            <div className="hero-container">
                <h1>
                    Найдите лучший товар.<br />
                    Вместо тысячи магазинов — один сервис.
                </h1>

                <p className="hero-subtitle">
                    Введите название товара — и мы найдём его на Wildberries, Ozon. <br />
                    Все предложения в одной таблице: сравните цены, продавцов и отзывы за минуту.
                </p>

                <SearchBar
                    style={{ maxWidth: "940px" }}
                    onSearch={handleSearch}
                />

                <div className="sources">
                    <span>Ищем на:</span>
                    <div className="badges">
                        <img src={wblogo} alt="Wildberries" className="badge-logo" />
                        <img src={ozonlogo} alt="Ozon" className="badge-logo" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;