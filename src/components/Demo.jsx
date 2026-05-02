import React, { useState } from "react";
import ResultsList from "./ResultsList/ResultsList.jsx";
import ProductCarousel from "./ProductCarousel/ProductCarousel.jsx";
import ResultsHeader from "./ResultsHeader/ResultsHeader.jsx";
import ViewToggle from "./ViewToggle/ViewToggle.jsx";
import "./Demo.css";

// Демо-данные для показа на главной
const demoData = [
    [
        {
            id: 1,
            name: "Тостер на два ломтика Scarlett SC-TM11020, 700 Вт",
            price: 1263,
            rating: 4.9,
            reviewsCount: 34493,
            imageUrl: "https://ir.ozone.ru/s3/multimedia-1-z/wc1000/7453092455.jpg",
            link: "https://www.ozon.ru/product/toster-na-dva-lomtika-scarlett-sc-tm11020-700-vt-1142461997/?at=83tBMARDZC4AGD7qfYjoyDmURZB97XhZPDyQLC5yq8p7",
            brand: "Scarlett",
            category: "Тостер",
            seller: "Официальный магазин Scarlett & Timberk",
            sellerRating: "4.8",
            platform: "ozon",
            isOriginal: true,
        },
        {
            id: 2,
            name: "Тостер для хлеба с поддоном для крошек SC-TM11020",
            price: 1499,
            rating: 4.9,
            reviewsCount: 18240,
            imageUrl: "https://basket-12.wbbasket.ru/vol1782/part178264/178264908/images/big/1.webp",
            link: "https://www.wildberries.ru/catalog/178264908/detail.aspx",
            brand: "Scarlett",
            category: "Приготовление блюд",
            seller: "Официальный магазин Scarlett & Timberk",
            sellerRating: "4.7",
            platform: "wb",
            isOriginal: true,
        },
        {
            id: 3,
            name: "Scarlett Тостер SC-TM11020 700 Вт тостов - 2, черный",
            price: 1241,
            rating: 4.8,
            reviewsCount: 10748,
            imageUrl: "https://ir.ozone.ru/s3/multimedia-1-t/wc1000/7662413801.jpg",
            link: "https://www.ozon.ru/product/scarlett-toster-sc-tm11020-700-vt-tostov-2-chernyy-3128666488/?at=16tLm0Y2DhklG0P3Tvly08qUY0w55ntxwGVjAsqR4G4M",
            brand: "Scarlett",
            category: "Тостеры",
            seller: "КЛИН ХАУС",
            sellerRating: "4.8",
            platform: "ozon",
            isOriginal: true,
        }
    ],
    [
        {
            id: 4,
            name: "Тостер Centek CT-1425 White Мощность 700Вт, Cъемный поддон для сбора крошек, Ненагревающийся корпус, Функция отмены",
            price: 1263,
            rating: 4.9,
            reviewsCount: 6228,
            imageUrl: "https://ir.ozone.ru/s3/multimedia-1-t/wc1000/8788508705.jpg",
            link: "https://www.ozon.ru/product/toster-centek-ct-1425-white-moshchnost-700vt-cemnyy-poddon-dlya-sbora-kroshek-1653956234/?at=QktJqKWMEc7XY2YqiJqBWR0TD2Ppg7IZGlxPxH8PBzrM",
            brand: "Centek",
            category: "Тостеры",
            seller: "CENTEK",
            sellerRating: "4.8",
            platform: "ozon",
            isOriginal: true
        },
        {
            id: 5,
            name: "Тостер CT-1425 (черный)",
            price: 1340,
            rating: 0,
            reviewsCount: 0,
            imageUrl: "https://basket-28.wbbasket.ru/vol5368/part536856/536856123/images/big/1.webp",
            link: "https://www.wildberries.ru/catalog/536856123/detail.aspx",
            brand: "Centek",
            category: "Приготовление блюд",
            seller: "Uratorg.ru",
            sellerRating: "4.7",
            platform: "wb",
            isOriginal: false
        }
    ]
];

function Demo() {
    const [view, setView] = useState("list");

    return (
        <div className="demo-wrapper">
            <div className="demo-header">
                <h2>Результаты поиска: "тостер"</h2>
                <ViewToggle view={view} setView={setView} />
            </div>

            <div className="demo-content">
                {demoData.map((products, index) => (
                    <div key={index}>
                        {view === "list" ? (
                            <>
                                {index === 0 && <ResultsHeader />}
                                <ResultsList products={products} />
                            </>
                        ) : (
                            <ProductCarousel products={products} />
                        )}
                        {/* 🔥 ЛИНИЯ: рисуем если это не последняя группа */}
                        {index !== demoData.length - 1 && (
                            <div className="group-divider"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Demo;