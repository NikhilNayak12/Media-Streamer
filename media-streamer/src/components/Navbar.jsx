import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="navbar">
            <Link to="/" className="navbar-logo">
                <span>MediaPlatform</span>
            </Link>

            <div className="navbar-search">
                <input 
                    type="text" 
                    placeholder="Search videos, creators..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
            </div>

            <div className="navbar-actions">
                <Link to="/upload">
                    <button className="navbar-button">Upload</button>
                </Link>
                <Link to="/profile">
                    <div className="navbar-profile">U</div>
                </Link>
            </div>
        </header>
    );
}

export default Navbar;
