import { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard";
import "./Home.css";

function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=12&key=${API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
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
        </section>
    );
}

export default Home;
