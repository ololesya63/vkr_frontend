import React from "react";
import "./Features.css";
import { FaBolt, FaLayerGroup, FaThLarge, FaThumbsUp } from "react-icons/fa";

function Features() {
    const features = [
        {
            icon: <FaBolt />,
            title: "Мгновенный поиск",
            desc: "Получайте результаты со всех маркетплейсов за секунды. Экономьте время на ручном поиске."
        },
        {
            icon: <FaThLarge />,
            title: "Удобное сравнение",
            desc: "Все найденные предложения выводятся в единой таблице с фильтрацией и сортировкой по цене, рейтингу, количеству отзывов."
        },
        {
            icon: <FaLayerGroup />,
            title: "Автоматическая группировка товаров",
            desc: "Алгоритм автоматически находит одинаковые товары по названию и характеристикам, группирует их для удобного сравнения."
        },
        {
            icon: <FaThumbsUp />,
            title: "Проверенные продавцы",
            desc: "Система показывает рейтинг продавца, количество отзывов. Помогает выбрать надежного продавца."
        }
    ];

    return (
        <section id="features" className="features">
            <div className="features-container">
                <h2 className="features-title">
                    Почему Честный<span>Товар</span>
                </h2>

                <div className="features-grid">
                    {features.map((item, i) => (
                        <div className="feature-item" key={i}>
                            <div className="feature-icon">{item.icon}</div>
                            <div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
