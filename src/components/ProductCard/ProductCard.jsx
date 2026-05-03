import React from "react";
import { FaStar } from "react-icons/fa";
import "./ProductCard.css";
import wbLogo from "../../assets/wb.jpg";
import ozonLogo from "../../assets/ozon.png";

function ProductCard({ product }) {
    const getPlatformLogo = (platform) => {
        if (!platform) return null;
        const p = platform.toLowerCase();
        if (p === "wb" || p === "wildberries") return wbLogo;
        if (p === "ozon") return ozonLogo;
        return null;
    };

    const renderStars = (rating = 0) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const fillPercentage = Math.min(Math.max(rating - (i - 1), 0), 1) * 100;
            stars.push(
                <div key={i} className="star-wrapper">
                    <FaStar className="star-bg" />
                    <FaStar className="star-fill" style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }} />
                </div>
            );
        }
        return stars;
    };

    return (
        <div className="product-card" onClick={() => window.open(product.link, "_blank")}>
            <div className="product-image"><img src={product.imageUrl} alt={product.name} /></div>
            <h3 className="product-name">{product.name}</h3>
            <div className="product-seller">
                {getPlatformLogo(product.platform) && <img src={getPlatformLogo(product.platform)} alt="platform" className="seller-logo" />}
                <span className="seller-text">{product.seller || "Неизвестный продавец"}</span>
            </div>
            <div className="product-rating">
                <div className="stars">{renderStars(product.rating)}</div>
                <span className="rating-value">{product.rating || "—"}</span>
            </div>
            <div className="product-reviews">{product.reviewsCount || 0} отзывов</div>
            <div className="product-price-wrapper">
                <div className="product-price">{product.price ? `${product.price.toLocaleString("ru-RU")} ₽` : "—"}</div>
                {product.isOriginal && <span className="original-check" data-tooltip="Оригинал">✓</span>}
            </div>
        </div>
    );
}

export default ProductCard;