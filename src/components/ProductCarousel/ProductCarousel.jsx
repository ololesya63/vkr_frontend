import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "../ProductCard/ProductCard.jsx";
import "./ProductCarousel.css";

const ProductCarousel = ({ products = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 3;

    const maxIndex = products.length - itemsPerPage;

    const nextSlide = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex((products.length - (currentIndex + 3)) >= 3 ? currentIndex + 3 : (products.length - (currentIndex + 3)) % 3);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 3 >= 0 ? currentIndex - 3 : 0);
        }
    };

    const canGoBack = currentIndex > 0;
    const canGoForward = currentIndex < maxIndex;

    return (
        <div className="product-carousel-wrapper"> {/* 🔥 НОВАЯ ОБЕРТКА */}
            <div className="product-carousel-container">
                <div className="carousel-wrapper">

                    {/* LEFT */}
                    <button
                        className={`carousel-arrow carousel-arrow-left ${canGoBack ? "active" : "disabled"}`}
                        onClick={prevSlide}
                        disabled={!canGoBack}
                    >
                        <FaChevronLeft />
                    </button>

                    <div className="carousel-viewport">
                        <div
                            className="product-carousel"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
                            }}
                        >
                            {products.map((product, index) => (
                                <ProductCard key={product.id || index} product={product} />
                            ))}
                        </div>
                    </div>

                    <button
                        className={`carousel-arrow carousel-arrow-right ${canGoForward ? "active" : "disabled"}`}
                        onClick={nextSlide}
                        disabled={!canGoForward}
                    >
                        <FaChevronRight />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ProductCarousel;