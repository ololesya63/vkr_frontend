import React from 'react';
import Hero from '../components/Hero/Hero.jsx';
import HowItWorks from '../components/HowItWorks/HowItWorks.jsx';
import Features from '../components/Features/Features.jsx';
import ResultsSection from "../components/ResultsSection/ResultsSection.jsx";
import "./Main.css";

import "../App.css";

function Main() {
    return (
        <>
            <Hero />
            <HowItWorks />
            <Features />
            <ResultsSection />
        </>
    );
}

export default Main;