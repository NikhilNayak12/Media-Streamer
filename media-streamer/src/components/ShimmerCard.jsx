import "./ShimmerCard.css";

function ShimmerCard() {
    return (
        <div className="shimmer-card">
            <div className="shimmer-thumb"></div>
            <div className="shimmer-line shimmer-line-wide"></div>
            <div className="shimmer-line shimmer-line-narrow"></div>
        </div>
    );
}

export default ShimmerCard;