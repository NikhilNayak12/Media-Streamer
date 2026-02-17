import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import "./Home.css";

function Search() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (query) {
            fetchSearchResults();
        } else {
            setLoading(false);
        }
    }, [query]);

    const fetchSearchResults = async () => {
        try {
            setLoading(true);
            const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
            const response = await fetch(
                `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${query}&key=${API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const data = await response.json();
            setVideos(data.items || []);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="home-container">
                <h1 className="home-title">Search Results for "{query}"</h1>
                <div className="loading">Searching...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="home-container">
                <h1 className="home-title">Search Results</h1>
                <div className="error">Error: {error}</div>
            </section>
        );
    }

    if (!query) {
        return (
            <section className="home-container">
                <h1 className="home-title">Search</h1>
                <p className="text-sm text-slate-400">Enter a search term to find videos</p>
            </section>
        );
    }

    return (
        <section className="home-container">
            <h1 className="home-title">Search Results for "{query}"</h1>
            {videos.length === 0 ? (
                <p className="text-sm text-slate-400">No results found</p>
            ) : (
                <div className="video-grid">
                    {videos.map((item) => {
                        // Convert search result to video format
                        const video = {
                            id: item.id.videoId || item.id,
                            snippet: item.snippet,
                            statistics: { viewCount: '0' }
                        };
                        return <VideoCard key={video.id} video={video} />;
                    })}
                </div>
            )}
        </section>
    );
}

export default Search;
