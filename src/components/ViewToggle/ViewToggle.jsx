import "./ViewToggle.css";
import { CiGrid41, CiGrid2H } from "react-icons/ci";

function ViewToggle({ view, setView }) {
    return (
        <div className="view-toggle">
            <button
                className={`view-btn ${view === "list" ? "active" : ""}`}
                onClick={() => setView("list")}
            >
                <CiGrid2H />
            </button>

            <button
                className={`view-btn ${view === "grid" ? "active" : ""}`}
                onClick={() => setView("grid")}
            >
                <CiGrid41 />
            </button>
        </div>
    );
}

export default ViewToggle;