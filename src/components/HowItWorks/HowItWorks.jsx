import React from 'react';
import './HowItWorks.css';

const steps = [
    {
        number: '1',
        title: 'Введите запрос',
        desc: 'Напишите название товара в поиске.'
    },
    {
        number: '2',
        title: 'Мы ищем и группируем',
        desc: 'Наш алгоритм находит товар на всех подключенных площадках и собирает всё в одну таблицу.'
    },
    {
        number: '3',
        title: 'Сравнивайте и выбирайте',
        desc: 'Напишите название, модель товара в поиске.'
    }
];

function HowItWorks() {
    return (
        <section id="how-it-works" className="how-it-works">
            <div className="container">
                <h2 className="section-title">Всего 3 шага до идеальной покупки</h2>
                <div className="steps">
                    {steps.map((step, idx) => (
                        <div className="step-card" key={idx}>
                            <div className="step-number">{step.number}</div>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;