import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">
            <nav>
                <ul className="sidebar-nav">
                    <li>
                        <NavLink to="/" className="sidebar-link">
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/watch" className="sidebar-link">
                            Watch
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/upload" className="sidebar-link">
                            Upload
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className="sidebar-link">
                            Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/search" className="sidebar-link">
                            Search
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
