import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import Pagination from "../components/Pagination";
import "./Home.css";

function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [nextToken, setNextToken] = useState(null);
    const [pageTokens, setPageTokens] = useState([null]);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async (pageToken = null) => {
        try {
            setLoading(true);
            setError(null);

            const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
            const tokenParam = pageToken ? `&pageToken=${pageToken}` : "";
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=12${tokenParam}&key=${API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }

            const data = await response.json();
            setVideos(data.items || []);
            setNextToken(data.nextPageToken || null);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (!nextToken) return;

        setPageTokens((previousTokens) => [...previousTokens, nextToken]);
        setPage((previousPage) => previousPage + 1);
        fetchVideos(nextToken);
    };

    const handlePrev = () => {
        if (page <= 1) return;

        const previousPage = page - 1;
        const prevToken = pageTokens[previousPage - 1] ?? null;
        setPageTokens((previousTokens) => previousTokens.slice(0, -1));
        setPage(previousPage);
        fetchVideos(prevToken);
    };

    if (loading) {
        return (
            <section className="home-container">
                <h1 className="home-title">Trending Videos</h1>
                <div className="loading">Loading videos...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="home-container">
                <h1 className="home-title">Trending Videos</h1>
                <div className="error">Error: {error}</div>
            </section>
        );
    }

    return (
        <section className="home-container">
            <h1 className="home-title">Trending Videos</h1>
            <div className="video-grid">
                {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
            <Pagination
                currentPage={page}
                hasNext={!!nextToken}
                hasPrev={page > 1}
                onNext={handleNext}
                onPrev={handlePrev}
            />
        </section>
    );
}

export default Home;
