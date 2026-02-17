import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import "./Layout.css";

function Layout({ children }) {
    return (
        <div className="layout-container">
            <Navbar />
            <div className="layout-content">
                <Sidebar />
                <main className="layout-main">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;