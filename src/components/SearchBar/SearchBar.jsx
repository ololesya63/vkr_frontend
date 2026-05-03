import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import "./SearchBar.css";

function SearchBar({ style, onClick, onSearch, value, disabled = false}) {
    const [searchQuery, setSearchQuery] = useState(value || "");

    // Синхронизируем с пропсом value
    useEffect(() => {
        if (value !== undefined) {
            setSearchQuery(value);
        }
    }, [value]);

    const handleSearch = () => {
        if (disabled) return;
        if (searchQuery.trim()) {
            // Поддержка обоих пропсов
            if (onSearch) {
                onSearch(searchQuery);
            } else if (onClick) {
                onClick(searchQuery);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-box" style={style}>
            <input
                type="text"
                className="search-input"
                placeholder='Например, "беспроводные наушники JBL"'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={disabled}
            />
            <button className="search-button" onClick={handleSearch} disabled={disabled}>
                <FiSearch className="search-icon" />
                Найти и сравнить
            </button>
        </div>
    );
}

export default SearchBar;