import React, {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from "react-router";
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
import {useGoodsStream} from "../useGoodsStream.js";
import "./ResultsPage.css";

const sortOptions = [
    {value: "popular", label: "Популярные"},
    {value: "rating", label: "По рейтингу"},
    {value: "cheap", label: "Дешевле"},
    {value: "expensive", label: "Дороже"},
    {value: "new", label: "Новинки"},
    {value: "sale", label: "Распродажа"}
];

function ResultsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";
    const [view, setView] = useState("list");

    // Состояния фильтров и сортировки (начальные значения по умолчанию)
    const [filters, setFilters] = useState({
        priceRange: [0, 150000],
        marketplaces: {wb: true, ozon: true},
        highRating: false,
        isOriginal: false,
        premiumSeller: false,
    });
    const [sort, setSort] = useState(sortOptions[0]);

    // Функция для перезагрузки данных с новыми параметрами (вызывается после Apply)
    const [requestParams, setRequestParams] = useState(null);

    const applyFiltersAndSort = (newFilters, newSort) => {
        if (!query) return; // не формируем параметры запроса, если нет поискового запроса
        setRequestParams({
            query,
            minPrice: newFilters.priceRange[0],
            maxPrice: newFilters.priceRange[1],
            platforms: Object.entries(newFilters.marketplaces).filter(([, v]) => v).map(([k]) => k).join(","),
            highRating: newFilters.highRating,
            original: newFilters.isOriginal,
            premium: newFilters.premiumSeller,
            sort: newSort.value,
        });
    };
    useEffect(() => {
        if (query) {
            applyFiltersAndSort(filters, sort);
        }
    }, [query]);

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
        if (query) {
            applyFiltersAndSort(newFilters, sort);
        }
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
        if (query) {
            applyFiltersAndSort(filters, newSort);
        }
    };

    const handleViewChange = (newView) => setView(newView);

    const handleSearch = (newQuery) => {
        navigate(`/results?query=${encodeURIComponent(newQuery)}`);
    };

    // Используем хук для получения данных с текущими requestParams
    const {step, data, isLoading, error} = useGoodsStream(requestParams);

    // Скелетон для списка
    const ListSkeleton = () => (
        <div className="skeleton-list-container">
            <div className="results-header">
                <div>Товар</div>
                <div>Продавец</div>
                <div>Рейтинг</div>
                <div>Отзывы</div>
                <div>Цена</div>
            </div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-row">
                    <div className="skeleton-product-cell">
                        <Skeleton circle={true} width={60} height={60}/>
                        <div style={{flex: 1, marginLeft: '1rem'}}>
                            <Skeleton count={2}/>
                        </div>
                    </div>
                    <div><Skeleton/></div>
                    <div><Skeleton width={60}/></div>
                    <div><Skeleton width={80}/></div>
                    <div><Skeleton width={100}/></div>
                </div>
            ))}
        </div>
    );

    const CarouselSkeleton = () => (
        <div className="skeleton-carousel-container">
            {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card">
                    <Skeleton height={200} style={{marginBottom: '1rem'}}/>
                    <Skeleton count={3}/>
                    <Skeleton width={100} style={{marginTop: '1rem'}}/>
                </div>
            ))}
        </div>
    );

    // Результаты загружены
    return (
        <div className="results-page-wrapper">
            <div className="search-bg-strip">
                <header className="search-header">
                    <SearchBar
                        value={query}
                        onSearch={handleSearch}
                        style={{width: "1440px", border: "1px solid #B0B7C3", boxShadow: "none"}}
                    />
                </header>
            </div>
            <div className="main-content-container">
                <div className="layout-grid">
                    <aside className="filters-side">
                        <Filters onApply={handleFilterApply} minPrice={0} maxPrice={150000}/>
                    </aside>
                    <main className="results-side">
                        {query && (isLoading || data) && (
                            <h2 className="results-title">Результаты поиска: "{query}"</h2>
                        )}
                        <div className="controls-panel">
                            <CustomSelect options={sortOptions} value={sort} onChange={handleSortChange}/>
                            <ViewToggle view={view} setView={handleViewChange}/>
                        </div>
                        {!query && <EmptyState/>}
                        {isLoading && (
                            <div className="content-render-area">
                                <StepLoader step={step}/>
                                {view === "list" ? <ListSkeleton/> : <CarouselSkeleton/>}
                            </div>
                        )}
                        {data && (
                            <div className="content-render-area">
                                {data.map((products, index) => (
                                    <React.Fragment key={index}>
                                        {view === "list" ? (
                                            <>
                                                {index === 0 && <ResultsHeader/>}
                                                <ResultsList products={products}/>
                                            </>
                                        ) : (
                                            <ProductCarousel products={products}/>
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