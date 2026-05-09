import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './Filters.css';
import wbLogo from '../../assets/wb.jpg';
import ozonLogo from '../../assets/ozon.png';

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

const COLLAPSED_COUNT = 3;

function Filters({ filters, onChange, onApply, minPrice = 0, maxPrice = 150000, disabled = false, dynamicFilters = [], dynamicSelections = {}, onDynamicChange, dynamicFiltersLoading = false }) {
    const [expanded, setExpanded] = React.useState({});
    const toggleExpanded = (groupName) => setExpanded(prev => ({ ...prev, [groupName]: !prev[groupName] }));
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
        for (const f of dynamicFilters) {
            onDynamicChange?.(f.groupName, f.type === 'range' ? [Number(f.min), Number(f.max)] : []);
        }
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

            {dynamicFiltersLoading && (
                <div className="filter-group">
                    <label className="filter-label">Характеристики</label>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="dynamic-filter-item">
                            <Skeleton width={120} height={14} style={{ marginBottom: 8 }} />
                            <Skeleton height={12} count={3} style={{ marginBottom: 6 }} />
                        </div>
                    ))}
                </div>
            )}

            {!dynamicFiltersLoading && dynamicFilters.length > 0 && (
                <div className="filter-group">
                    <label className="filter-label">Характеристики</label>
                    {dynamicFilters.map((f) => {
                        if (f.type === 'range') {
                            const min = Number(f.min);
                            const max = Number(f.max);
                            const value = dynamicSelections[f.groupName] || [min, max];
                            return (
                                <div key={f.groupName} className="dynamic-filter-item">
                                    <label className="filter-sublabel">{f.groupName}</label>
                                    <div className="price-slider">
                                        <Slider
                                            range
                                            min={min}
                                            max={max}
                                            value={value}
                                            onChange={v => onDynamicChange?.(f.groupName, v)}
                                            trackStyle={{ backgroundColor: '#2f4de0', height: 4 }}
                                            handleStyle={{ borderColor: '#2f4de0', backgroundColor: '#2f4de0', opacity: 1 }}
                                            railStyle={{ backgroundColor: '#e0e0e0', height: 4 }}
                                            disabled={disabled}
                                        />
                                    </div>
                                    <div className="price-inputs">
                                        <input
                                            type="number"
                                            value={value[0]}
                                            onChange={e => onDynamicChange?.(f.groupName, [+e.target.value, value[1]])}
                                            min={min}
                                            max={value[1]}
                                            disabled={disabled}
                                        />
                                        <span>—</span>
                                        <input
                                            type="number"
                                            value={value[1]}
                                            onChange={e => onDynamicChange?.(f.groupName, [value[0], +e.target.value])}
                                            min={value[0]}
                                            max={max}
                                            disabled={disabled}
                                        />
                                    </div>
                                </div>
                            );
                        }
                        const selected = dynamicSelections[f.groupName] || [];
                        const sorted = [...f.values].sort((a, b) => b.platforms.length - a.platforms.length);
                        const isExpanded = expanded[f.groupName];
                        const visible = isExpanded ? sorted : sorted.slice(0, COLLAPSED_COUNT);
                        return (
                            <div key={f.groupName} className="dynamic-filter-item">
                                <label className="filter-sublabel">{f.groupName}</label>
                                {visible.map(({ value, platforms }) => (
                                    <label key={value} className="checkbox-label checkbox-label--between">
                                        <span className="checkbox-label__left">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(value)}
                                                onChange={e => {
                                                    const next = e.target.checked
                                                        ? [...selected, value]
                                                        : selected.filter(v => v !== value);
                                                    onDynamicChange?.(f.groupName, next);
                                                }}
                                                disabled={disabled}
                                            />
                                            {capitalize(value)}
                                        </span>
                                        {platforms.length === 1 && (
                                            <img
                                                src={platforms[0] === 'wb' ? wbLogo : ozonLogo}
                                                alt={platforms[0]}
                                                className="platform-logo"
                                            />
                                        )}
                                    </label>
                                ))}
                                {sorted.length > COLLAPSED_COUNT && (
                                    <button className="show-more-btn" onClick={() => toggleExpanded(f.groupName)}>
                                        {isExpanded ? 'Скрыть' : `Ещё ${sorted.length - COLLAPSED_COUNT}`}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <button className="apply-btn" onClick={() => onApply(filters)} disabled={disabled || dynamicFiltersLoading}>
                {dynamicFiltersLoading ? 'Загрузка фильтров...' : 'Применить'}
            </button>
        </aside>
    );
}

export default Filters;