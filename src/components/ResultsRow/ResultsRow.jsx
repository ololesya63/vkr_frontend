import "./ResultsRow.css"
import wbLogo from "../../assets/wb.jpg";
import ozonLogo from "../../assets/ozon.png";
import { FiExternalLink } from "react-icons/fi";

function ResultsRow({ product }) {
    const getPlatformLogo = (platform) => {
        if (!platform) return null;
        const p = platform.toLowerCase();
        if (p === "wb" || p === "wildberries") return wbLogo;
        if (p === "ozon") return ozonLogo;
        return null;
    };

    return (
        <div className="results-row">
            <div className="product-cell">
                <img src={product.imageUrl} alt={product.name} className="main-product-img" />

                <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <div className="platform-wrapper">
                        {getPlatformLogo(product.platform) && (
                            <img
                                src={getPlatformLogo(product.platform)}
                                className="marketplace-logo"
                                alt="platform"
                            />
                        )}
                        {product.isOriginal && (
                            <span
                                className="original-check"
                                title="Оригинал"
                                data-tooltip="Оригинал"
                            >
                                ✓
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="cell">
                <span className="seller-name">{product.seller}</span>
            </div>

            <div className="cell rating-cell">
                {product.rating}
            </div>

            <div className="cell">
                {product.reviewsCount}
            </div>

            <div className="cell price-cell">
                {product.price.toLocaleString('ru-RU')} ₽
            </div>
            <div className="cell link-cell">
                <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                >
                    <FiExternalLink />
                </a>
            </div>
        </div>
    );
}

export default ResultsRow;