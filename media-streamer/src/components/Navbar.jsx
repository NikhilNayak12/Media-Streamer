import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import "./Navbar.css";

function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState(() => {
        const saved = localStorage.getItem("searchHistory");
        return saved ? JSON.parse(saved) : [];
    });
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e?.preventDefault();
        const normalizedQuery = searchQuery.trim();
        if (!normalizedQuery) return;

        setSearchHistory((prev) => {
            const updated = [
                normalizedQuery,
                ...prev.filter((item) => item !== normalizedQuery),
            ].slice(0, 10);

            localStorage.setItem("searchHistory", JSON.stringify(updated));
            return updated;
        });

        navigate(`/search?q=${encodeURIComponent(normalizedQuery)}`);
    };

    const filteredSuggestions = useMemo(() => {
        return searchHistory.filter(item =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, searchHistory]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch(e);
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
                {searchQuery.trim() && filteredSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {filteredSuggestions.slice(0, 5).map((item, index) => (
                            <li
                                key={`${item}-${index}`}
                                className="suggestion-item"
                                onClick={() => {
                                    setSearchQuery(item);
                                    navigate(`/search?q=${encodeURIComponent(item)}`);
                                }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
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
