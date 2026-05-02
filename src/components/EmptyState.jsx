import "./EmptyState.css";

function EmptyState() {
    return (
        <div className="empty-state">
            <div className="illustration">
                <div className="cloud">
                    <div className="cloud-dot"></div>
                    <div className="cloud-dot"></div>
                    <div className="cloud-dot"></div>
                    <div className="cloud-dot"></div>
                    <div className="cloud-dot"></div>

                    <div className="cloud-shape">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <h3>Введите запрос</h3>
            <p>Чтобы увидеть результаты поиска</p>
        </div>
    );
}

export default EmptyState;