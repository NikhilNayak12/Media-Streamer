function Pagination({ currentPage, hasNext, hasPrev, onNext, onPrev }) {
    return (
        <div className="pagination-controls">
            <button
                type="button"
                className="pagination-btn"
                onClick={onPrev}
                disabled={!hasPrev}
            >
                Prev
            </button>
            <span className="pagination-page">Page {currentPage}</span>
            <button
                type="button"
                className="pagination-btn"
                onClick={onNext}
                disabled={!hasNext}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
