import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Watch.css";

function Watch() {
	const { id } = useParams();
	const [videoDetails, setVideoDetails] = useState(null);
	const [recommendations, setRecommendations] = useState([]);
	const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchVideoDetails = async () => {
            try {
                const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`
                );
                const data = await response.json();
                if (data.items && data.items.length > 0) {
					const video = data.items[0];
					setVideoDetails(video);

					const historyItem = {
						id,
						title: video.snippet?.title || "Untitled",
						thumbnail: video.snippet?.thumbnails?.medium?.url || "",
					};
					const existing = JSON.parse(
						localStorage.getItem("watchHistory") || "[]"
					);
					const updated = [
						historyItem,
						...existing.filter((item) => item.id !== id),
					].slice(0, 50);
					localStorage.setItem("watchHistory", JSON.stringify(updated));
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching video details:', err);
                setLoading(false);
            }
        };

        const fetchRecommendations = async () => {
            try {
                const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
                // First, try to get video category
                const videoResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${API_KEY}`
                );
                const videoData = await videoResponse.json();
                
                let searchQuery = '';
                if (videoData.items && videoData.items.length > 0) {
                    const videoSnippet = videoData.items[0].snippet;
                    // Use tags or title for search
                    if (videoSnippet.tags && videoSnippet.tags.length > 0) {
                        searchQuery = videoSnippet.tags[0];
                    } else {
                        // Use first few words of title
                        searchQuery = videoSnippet.title.split(' ').slice(0, 3).join(' ');
                    }
                }
                
                // Fetch recommendations based on search query
                const response = await fetch(
                    `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(searchQuery)}&type=video&key=${API_KEY}`
                );
                const data = await response.json();
                // Filter out the current video
                const filtered = (data.items || []).filter(item => {
                    const videoId = item.id.videoId || item.id;
                    return videoId !== id;
                });
                setRecommendations(filtered);
            } catch (err) {
                console.error('Error fetching recommendations:', err);
            }
        };

        fetchVideoDetails();
        fetchRecommendations();
    }, [id]);

	if (loading) {
		return <div className="watch-loading">Loading video...</div>;
	}

	if (!videoDetails) {
		return <div className="watch-error">Video not found</div>;
	}

	const { snippet, statistics } = videoDetails;

	return (
		<section className="watch-layout">
			<div className="watch-main">
				<div className="video-player">
					<iframe
						width="100%"
						height="100%"
						src={`https://www.youtube.com/embed/${id}?autoplay=1`}
						title={snippet.title}
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					></iframe>
				</div>
				<div className="video-details">
					<h1 className="video-title-watch">{snippet.title}</h1>
					<div className="video-metadata">
						<p className="video-channel-watch">{snippet.channelTitle}</p>
						<p className="video-views">{formatViews(statistics.viewCount)} views</p>
					</div>
					<div className="video-description">
						<h3>Description</h3>
						<p>{snippet.description}</p>
					</div>
				</div>
			</div>
			<aside className="recommendations">
				<h2 className="recommendations-title">Recommended</h2>
				<div className="recommendations-list">
					{recommendations.map((item) => {
						const videoId = item.id.videoId || item.id;
						return (
							<Link
								key={videoId}
								to={`/watch/${videoId}`}
								className="recommendation-item"
							>
								<img
									src={item.snippet.thumbnails.medium.url}
									alt={item.snippet.title}
									className="recommendation-thumbnail"
								/>
								<div className="recommendation-info">
									<h3 className="recommendation-title">{item.snippet.title}</h3>
									<p className="recommendation-channel">{item.snippet.channelTitle}</p>
								</div>
							</Link>
						);
					})}
				</div>
			</aside>
		</section>
	);
}

function formatViews(views) {
	const num = parseInt(views);
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M';
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'K';
	}
	return num.toString();
}

export default Watch;
