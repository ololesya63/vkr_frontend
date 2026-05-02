import React, { useState } from "react";
import ResultsRow from "../ResultsRow/ResultsRow";
import "./ResultsRowGroup.css";

function ResultsRowGroup({ products }) {
    const initialCount = 2;
    const [visibleCount, setVisibleCount] = useState(initialCount);

    const visibleProducts = products.slice(0, visibleCount);
    const remaining = products.length - visibleCount;

    const showAll = () => {
        setVisibleCount(products.length); // 🔥 показываем всё
    };

    const getWord = (num) => {
        if (num % 10 === 1 && num % 100 !== 11) return "товар";
        if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) return "товара";
        return "товаров";
    };

    return (
        <div className="results-group">

            {visibleProducts.map((product, index) => (
                <ResultsRow key={index} product={product} />
            ))}

            {remaining > 0 && (
                <button className="show-more" onClick={showAll}>
                    Показать еще {remaining} {getWord(remaining)}
                </button>
            )}

        </div>
    );
}

export default ResultsRowGroup;