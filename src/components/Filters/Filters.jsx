import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './Filters.css';

function Filters({ filters, onChange, onApply, minPrice = 0, maxPrice = 150000, disabled = false }) {
    const { priceRange, marketplaces, highRating, isOriginal, premiumSeller } = filters;

    const handlePriceChange = (value) => {
        onChange({ ...filters, priceRange: value });
    };

    const handleMarketplaceChange = (platform) => {
        onChange({
            ...filters,
            marketplaces: { ...marketplaces, [platform]: !marketplaces[platform] }
        });
    };

    const handleHighRatingChange = () => {
        onChange({ ...filters, highRating: !highRating });
    };

    const handleOriginalChange = () => {
        onChange({ ...filters, isOriginal: !isOriginal });
    };

    const handlePremiumChange = () => {
        onChange({ ...filters, premiumSeller: !premiumSeller });
    };

    const handleReset = () => {
        const defaultFilters = {
            priceRange: [minPrice, maxPrice],
            marketplaces: { wb: true, ozon: true },
            highRating: false,
            isOriginal: false,
            premiumSeller: false,
        };
        onChange(defaultFilters);
        onApply(defaultFilters);
    };

    return (
        <aside className="filters-container">
            <div className="filters-header">
                <h3>Фильтры</h3>
                <button className="reset-btn" onClick={handleReset} disabled={disabled}>
                    Сбросить
                </button>
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
                        disabled={disabled}
                    />
                </div>
                <div className="price-inputs">
                    <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange([+e.target.value, priceRange[1]])}
                        min={minPrice}
                        max={priceRange[1]}
                        disabled={disabled}
                    />
                    <span>—</span>
                    <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange([priceRange[0], +e.target.value])}
                        min={priceRange[0]}
                        max={maxPrice}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="filter-group">
                <label className="filter-label">Маркетплейсы</label>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={marketplaces.wb}
                        onChange={() => handleMarketplaceChange('wb')}
                        disabled={disabled}
                    />
                    Wildberries
                </label>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={marketplaces.ozon}
                        onChange={() => handleMarketplaceChange('ozon')}
                        disabled={disabled}
                    />
                    Ozon
                </label>
            </div>

            <div className="filter-group">
                <label className="filter-label">Качество товара</label>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={highRating}
                        onChange={handleHighRatingChange}
                        disabled={disabled}
                    />
                    Высокий рейтинг товара
                </label>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={isOriginal}
                        onChange={handleOriginalChange}
                        disabled={disabled}
                    />
                    Оригинал
                </label>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={premiumSeller}
                        onChange={handlePremiumChange}
                        disabled={disabled}
                    />
                    Премиум-продавец
                </label>
            </div>

            <button className="apply-btn" onClick={() => onApply(filters)} disabled={disabled}>
                Применить
            </button>
        </aside>
    );
}

export default Filters;