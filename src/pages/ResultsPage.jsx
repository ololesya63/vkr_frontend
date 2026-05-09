import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import ViewToggle from "../components/ViewToggle/ViewToggle.jsx";
import CustomSelect from "../components/CustomSelect/CustomSelect.jsx";
import ResultsList from "../components/ResultsList/ResultsList.jsx";
import ProductCarousel from "../components/ProductCarousel/ProductCarousel.jsx";
import Filters from "../components/Filters/Filters.jsx";
import ResultsHeader from "../components/ResultsHeader/ResultsHeader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import StepLoader from "../components/StepLoader.jsx";
import { useGoodsStream } from "../useGoodsStream.js";
import "./ResultsPage.css";

const sortOptions = [
    { value: "popular", label: "Популярные" },
    { value: "rating", label: "По рейтингу" },
    { value: "cheap", label: "Дешевле" },
    { value: "expensive", label: "Дороже" },
    { value: "new", label: "Новинки" },
];

function ResultsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";
    const [view, setView] = useState("list");

    // Применённые фильтры (реально используемые в запросе)
    const [appliedFilters, setAppliedFilters] = useState({
        priceRange: [0, 150000],
        marketplaces: { wb: true, ozon: true },
        highRating: false,
        isOriginal: false,
        premiumSeller: false,
    });

    // Черновик фильтров (то, что видит пользователь в UI)
    const [draftFilters, setDraftFilters] = useState(appliedFilters);

    const [sort, setSort] = useState(sortOptions[0]);
    const [requestParams, setRequestParams] = useState(null);

    // Функция отправки запроса (использует переданные фильтры)
    const applyFiltersAndSort = (filtersToApply, sortValue, dynSelections = {}) => {
        if (!query) return;

        const wbDynamicFilters = [];
        const ozonDynamicFilters = [];
        let forceDisableWb = false;
        let forceDisableOzon = false;

        for (const filterDef of dynamicFilters) {
            const { groupName, type, wbKey } = filterDef;
            const selected = dynSelections[groupName];
            if (!selected) continue;

            if (type === 'range') {
                const [min, max] = selected;
                const defaultMin = Number(filterDef.min);
                const defaultMax = Number(filterDef.max);
                if (min === defaultMin && max === defaultMax) continue;
                if (wbKey) wbDynamicFilters.push({ key: wbKey, type: 'range', min, max });
                ozonDynamicFilters.push({ name: groupName, type: 'range', min, max });
            } else if (type === 'text' && selected.length > 0) {
                const wbIds = [];
                for (const selVal of selected) {
                    const valDef = filterDef.values.find(v => v.value === selVal);
                    if (!valDef) continue;
                    if (valDef.wbId) wbIds.push(valDef.wbId);
                    // Если значение есть только на одной платформе — отключаем другую
                    if (valDef.platforms.length === 1 && valDef.platforms[0] === 'ozon') forceDisableWb = true;
                    if (valDef.platforms.length === 1 && valDef.platforms[0] === 'wb') forceDisableOzon = true;
                }
                if (wbKey && wbIds.length > 0) {
                    wbDynamicFilters.push({ key: wbKey, type: 'text', ids: wbIds });
                }
                const ozonValues = selected.filter(selVal => {
                    const valDef = filterDef.values.find(v => v.value === selVal);
                    return valDef?.platforms?.includes('ozon');
                });
                if (ozonValues.length > 0) {
                    ozonDynamicFilters.push({ name: groupName, type: 'text', values: ozonValues });
                }
            }
        }

        const effectivePlatforms = Object.entries(filtersToApply.marketplaces)
            .filter(([k, v]) => {
                if (!v) return false;
                if (k === 'wb' && forceDisableWb) return false;
                if (k === 'ozon' && forceDisableOzon) return false;
                return true;
            })
            .map(([k]) => k)
            .join(",");

        setRequestParams({
            query,
            minPrice: filtersToApply.priceRange[0],
            maxPrice: filtersToApply.priceRange[1],
            platforms: effectivePlatforms,
            highRating: filtersToApply.highRating,
            original: filtersToApply.isOriginal,
            premium: filtersToApply.premiumSeller,
            sort: sortValue.value,
            wbDynamicFilters,
            ozonDynamicFilters,
        });
    };

    // Применяем черновик (кнопка "Применить")
    const handleApplyFilters = (newDraft) => {
        setAppliedFilters(newDraft);
        setDraftFilters(newDraft);
        if (query) {
            applyFiltersAndSort(newDraft, sort, dynamicSelections);
        }
    };

    // Изменение черновика (без отправки запроса)
    const handleDraftChange = (newDraft) => {
        setDraftFilters(newDraft);
    };

    // Сортировка: если фильтры в черновике отличаются от применённых,
    // то сначала применяем их, затем отправляем запрос с новой сортировкой.
    const handleSortChange = (newSort) => {
        setSort(newSort);
        if (!query) return;

        const filtersChanged = JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters);
        const filtersToUse = filtersChanged ? draftFilters : appliedFilters;

        if (filtersChanged) {
            setAppliedFilters(draftFilters);
        }
        applyFiltersAndSort(filtersToUse, newSort, dynamicSelections);
    };

    const handleViewChange = (newView) => setView(newView);

    const handleSearch = (newQuery) => {
        if (newQuery === query) {
            if (dynamicFilters.length === 0) {
                fetchDynamicFilters(query);
            }
            setAppliedFilters(draftFilters);
            applyFiltersAndSort(draftFilters, sort, dynamicSelections);
        } else {
            navigate(`/results?query=${encodeURIComponent(newQuery)}`);
        }
    };

    // Первоначальная загрузка после появления query
    useEffect(() => {
        if (query) {
            applyFiltersAndSort(draftFilters, sort, {});
        }
    }, [query]);

    const [dynamicFilters, setDynamicFilters] = useState([]);
    const [dynamicSelections, setDynamicSelections] = useState({});
    const [dynamicFiltersLoading, setDynamicFiltersLoading] = useState(false);

    const fetchDynamicFilters = (q) => {
        if (!q) return;
        setDynamicFiltersLoading(true);
        fetch(`http://localhost:3000/dynamic-filters-final?query=${encodeURIComponent(q)}`)
            .then(r => r.json())
            .then(data => {
                setDynamicFilters(data);
                const init = {};
                for (const f of data) {
                    init[f.groupName] = f.type === 'range' ? [Number(f.min), Number(f.max)] : [];
                }
                setDynamicSelections(init);
            })
            .catch(() => {})
            .finally(() => setDynamicFiltersLoading(false));
    };

    useEffect(() => {
        fetchDynamicFilters(query);
    }, [query]);

    const handleDynamicChange = (groupName, value) => {
        setDynamicSelections(prev => ({ ...prev, [groupName]: value }));
    };

    const { step, data, isLoading, error } = useGoodsStream(requestParams);

    // Скелетоны (без изменений)
    const ListSkeleton = () => (
        <div className="skeleton-list-container">
            <div className="results-header">
                <div>Товар</div>
                <div>Продавец</div>
                <div>Рейтинг</div>
                <div>Отзывы</div>
                <div>Цена</div>
                <div>Ссылка</div>
            </div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-row">
                    <div className="skeleton-product-cell">
                        <Skeleton circle={true} width={60} height={60} />
                        <div style={{ flex: 1, marginLeft: '1rem' }}>
                            <Skeleton count={2} />
                        </div>
                    </div>
                    <div><Skeleton /></div>
                    <div><Skeleton width={60} /></div>
                    <div><Skeleton width={100} /></div>
                    <div><Skeleton width={100} /></div>
                    <div><Skeleton width={100} /></div>
                </div>
            ))}
        </div>
    );

    const CarouselSkeleton = () => (
        <div className="skeleton-carousel-container">
            {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card">
                    <Skeleton height={200} style={{ marginBottom: '1rem' }} />
                    <Skeleton count={3} />
                    <Skeleton width={100} style={{ marginTop: '1rem' }} />
                </div>
            ))}
        </div>
    );

    return (
        <div className="results-page-wrapper">
            <div className="search-bg-strip">
                <header className="search-header">
                    <SearchBar
                        value={query}
                        onSearch={handleSearch}
                        style={{ width: "1440px", border: "1px solid #B0B7C3", boxShadow: "none" }}
                        disabled={isLoading}
                    />
                </header>
            </div>
            <div className="main-content-container">
                <div className="layout-grid">
                    <aside className="filters-side">
                        <Filters
                            filters={draftFilters}
                            onChange={handleDraftChange}
                            onApply={handleApplyFilters}
                            minPrice={0}
                            maxPrice={150000}
                            disabled={isLoading}
                            dynamicFilters={dynamicFilters}
                            dynamicSelections={dynamicSelections}
                            onDynamicChange={handleDynamicChange}
                            dynamicFiltersLoading={dynamicFiltersLoading}
                        />
                    </aside>
                    <main className="results-side">
                        <h2 className="results-title">
                            {query ? `Результаты поиска: "${query}"` : '\u00A0'}
                        </h2>
                        <div className="controls-panel">
                            <CustomSelect
                                options={sortOptions}
                                value={sort}
                                onChange={handleSortChange}
                                disabled={isLoading}
                            />
                            <ViewToggle view={view} setView={handleViewChange} />
                        </div>
                        {!query && <EmptyState />}
                        {isLoading && (
                            <div className="content-render-area">
                                <StepLoader step={step} />
                                {view === "list" ? <ListSkeleton /> : <CarouselSkeleton />}
                            </div>
                        )}
                        {data && (
                            <div className="content-render-area">
                                {data.map((products, index) => (
                                    <React.Fragment key={index}>
                                        {view === "list" ? (
                                            <>
                                                {index === 0 && <ResultsHeader />}
                                                <ResultsList products={products} />
                                            </>
                                        ) : (
                                            <ProductCarousel products={products} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                        {error && <div className="error-message">Ошибка: {error}</div>}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default ResultsPage;