import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";

function WatchHistory() {
    const [history, setHistory] = useState(() => {
        const stored = 
        JSON.parse(localStorage.getItem("watchHistory") || "[]");
        return stored;
    });
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key !== "watchHistory") return;
            const updated = JSON.parse(event.newValue || "[]");
            setHistory(updated);
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    console.log("Watch History:", history);

    function clearHistory() {
        localStorage.removeItem("watchHistory");
        setHistory([]);
    }

    return (
        <section className="watch-history">
            <div className="watch-history-header">
                <h1>Watch History</h1>
                <button type="button" onClick={clearHistory}>
                    Clear History
                </button>
            </div>

            {history.length === 0 ? (
                <p>No watch history yet.</p>
            ) : (
                <ul className="watch-history-list">
                    {history.map((item, index) => {
                        const videoId = item?.id || item?.videoId || item?.video?.id || item;
                        const title = item?.title || item?.snippet?.title || "Untitled";
                        const thumbnail =
                            item?.thumbnail ||
                            item?.snippet?.thumbnails?.medium?.url ||
                            item?.snippet?.thumbnails?.default?.url ||
                            null;

                        return (
                            <li
                                key={`${videoId}-${index}`}
                                className="watch-history-item"
                                onClick={() => navigate(`/watch/${videoId}`)}
                            >
                                {thumbnail && (
                                    <img
                                        src={thumbnail}
                                        alt={title}
                                        className="watch-history-thumb"
                                    />
                                )}
                                <div className="watch-history-info">
                                    <h3>{title}</h3>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

export default WatchHistory;
