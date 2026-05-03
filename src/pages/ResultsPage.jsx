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
    const applyFiltersAndSort = (filtersToApply, sortValue) => {
        if (!query) return;
        setRequestParams({
            query,
            minPrice: filtersToApply.priceRange[0],
            maxPrice: filtersToApply.priceRange[1],
            platforms: Object.entries(filtersToApply.marketplaces)
                .filter(([, v]) => v)
                .map(([k]) => k)
                .join(","),
            highRating: filtersToApply.highRating,
            original: filtersToApply.isOriginal,
            premium: filtersToApply.premiumSeller,
            sort: sortValue.value,
        });
    };

    // Применяем черновик (кнопка "Применить")
    const handleApplyFilters = (newDraft) => {
        setAppliedFilters(newDraft);
        setDraftFilters(newDraft);
        if (query) {
            applyFiltersAndSort(newDraft, sort);
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
        applyFiltersAndSort(filtersToUse, newSort);
    };

    const handleViewChange = (newView) => setView(newView);

    const handleSearch = (newQuery) => {
        navigate(`/results?query=${encodeURIComponent(newQuery)}`);
    };

    // Первоначальная загрузка после появления query
    useEffect(() => {
        if (query) {
            applyFiltersAndSort(appliedFilters, sort);
        }
    }, [query]);

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