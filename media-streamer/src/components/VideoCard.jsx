import { Link } from "react-router-dom";

function VideoCard({ video }) {
    const { snippet, statistics } = video;
    const thumbnail = snippet.thumbnails.medium.url;
    const title = snippet.title;
    const channelTitle = snippet.channelTitle;
    const views = formatViews(statistics.viewCount);

    return (
        <Link to={`/watch/${video.id}`} className="video-card">
            <img src={thumbnail} alt={title} className="video-thumbnail" />
            <div className="video-info">
                <h3 className="video-title">{title}</h3>
                <p className="video-channel">{channelTitle}</p>
                <p className="video-stats">{views} views</p>
            </div>
        </Link>
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

export default VideoCard;