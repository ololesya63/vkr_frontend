import React from 'react';
import "./App.css";
import {Route, Routes} from "react-router";
import Main from "./pages/Main.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {
    return (
        <div className="App">
            <Header />

            <main>
                <Routes>
                    <Route index element={<Main />} />
                    <Route path="results" element={<ResultsPage />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;