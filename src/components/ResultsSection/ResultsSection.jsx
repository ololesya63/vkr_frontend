import React from "react";
import Demo from "../Demo.jsx";
import "./ResultsSection.css";

function ResultsSection() {
    return (
        <section id="results" className="results-section">
            <div className="results-container">
                <h2 className="section-title">Пример результатов</h2>
                <Demo />
            </div>
        </section>
    );
}

export default ResultsSection;