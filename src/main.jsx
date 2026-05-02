import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import './pages/Main.css'
import App from './App.jsx';

const root = document.getElementById("root");

// 🔥 создаём клиент
const queryClient = new QueryClient();

ReactDOM.createRoot(root).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </QueryClientProvider>
);