import ResultsHeader from "../ResultsHeader/ResultsHeader";
import ResultsRowGroup from "../ReultsRowGroup/ResultsRowGroup";
import "./ResultsList.css";

function ResultsList({ products }) {
    return (
        <div className="results-list">

            <ResultsRowGroup products={products} />

        </div>
    );
}

export default ResultsList;