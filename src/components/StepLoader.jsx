import "./StepLoader.css";

function StepLoader({ step = 1 }) {
    const steps = [
        "Ищем товары на маркетплейсах",
        "Обрабатываем данные",
        "Объединяем и группируем",
    ];

    return (
        <div className="step-loader">
            {steps.map((text, index) => {
                const current = index + 1;
                return (
                    <div key={index} className="step-item">
                        <div
                            className={`step-dot ${
                                current < step ? "done" : current === step ? "active" : ""
                            }`}
                        />
                        <div className={`step-text ${current <= step ? "visible" : ""}`}>
                            {text}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default StepLoader;