import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './Filters.css';

function Filters({ onApply = () => {}, minPrice = 0, maxPrice = 150000 }) {
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [marketplaces, setMarketplaces] = useState({
        wb: true,
        ozon: true,
    });
    const [highRating, setHighRating] = useState(false);
    const [isOriginal, setIsOriginal] = useState(false);
    const [premiumSeller, setPremiumSeller] = useState(false);

    const handleApply = () => {
        const filters = {
            priceRange,
            marketplaces,
            highRating,
            isOriginal,
            premiumSeller,
        };
        onApply(filters);
    };

    const handleReset = () => {
        const defaultPriceRange = [minPrice, maxPrice];
        const defaultMarketplaces = { wb: true, ozon: true };
        setPriceRange(defaultPriceRange);
        setMarketplaces(defaultMarketplaces);
        setHighRating(false);
        setIsOriginal(false);
        setPremiumSeller(false);
        // Сразу применяем сброшенные фильтры
        onApply({
            priceRange: defaultPriceRange,
            marketplaces: defaultMarketplaces,
            highRating: false,
            isOriginal: false,
            premiumSeller: false,
        });
    };

    const handlePriceChange = (value) => setPriceRange(value);
    const handleMarketplaceChange = (platform) => {
        setMarketplaces(prev => ({ ...prev, [platform]: !prev[platform] }));
    };

    return (
        <aside className="filters-container">
            <div className="filters-header">
                <h3>Фильтры</h3>
                <button className="reset-btn" onClick={handleReset}>Сбросить</button>
            </div>

            <div className="filter-group">
                <label className="filter-label">Цена</label>
                <div className="price-slider">
                    <Slider
                        range
                        min={minPrice}
                        max={maxPrice}
                        value={priceRange}
                        onChange={handlePriceChange}
                        trackStyle={{ backgroundColor: '#2f4de0', height: 4 }}
                        handleStyle={{ borderColor: '#2f4de0', backgroundColor: '#2f4de0', opacity: 1 }}
                        railStyle={{ backgroundColor: '#e0e0e0', height: 4 }}
                    />
                </div>
                <div className="price-inputs">
                    <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} min={minPrice} max={priceRange[1]} />
                    <span>—</span>
                    <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} min={priceRange[0]} max={maxPrice} />
                </div>
            </div>

            <div className="filter-group">
                <label className="filter-label">Маркетплейсы</label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={marketplaces.wb} onChange={() => handleMarketplaceChange('wb')} />
                    Wildberries
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={marketplaces.ozon} onChange={() => handleMarketplaceChange('ozon')} />
                    Ozon
                </label>
            </div>

            <div className="filter-group">
                <label className="filter-label">Качество товара</label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={highRating} onChange={() => setHighRating(!highRating)} />
                    Высокий рейтинг товара
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={isOriginal} onChange={() => setIsOriginal(!isOriginal)} />
                    Оригинал
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={premiumSeller} onChange={() => setPremiumSeller(!premiumSeller)} />
                    Премиум-продавец
                </label>
            </div>

            <button className="apply-btn" onClick={handleApply}>Применить</button>
        </aside>
    );
}

export default Filters;