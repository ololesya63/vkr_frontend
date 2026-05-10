import "./StepLoader.css";

function StepLoader({ step = 1 }) {
    const steps = [
        "Обрабатываем запрос",
        "Ищем товары на маркетплейсах",
        "Группируем товары",
    ];

    return (
        <div className="step-loader">
            {steps.map((text, index) => {
                const current = index + 1;
                const isDone = current < step;
                const isActive = current === step;
                const isLast = index === steps.length - 1;

                return (
                    <div key={index} className="step-row">
                        <div className="step-item">
                            <div className={`step-dot ${isDone ? "done" : isActive ? "active" : ""}`}>
                                {isDone && <span className="step-check">✓</span>}
                            </div>
                            <span className={`step-text ${current <= step ? "visible" : ""}`}>
                                {text}
                            </span>
                        </div>
                        {!isLast && <span className="step-sep">›</span>}
                    </div>
                );
            })}
        </div>
    );
}

export default StepLoader;