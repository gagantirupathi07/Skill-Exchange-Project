import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <aside className="admin-sidebar">

            <div className="admin-sidebar-header">
                <h2>Skill Exchange</h2>
                <span>Admin Panel</span>
            </div>

            <nav className="admin-sidebar-nav">

                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar-link active"
                            : "admin-sidebar-link"
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/skills"
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar-link active"
                            : "admin-sidebar-link"
                    }
                >
                    Skills
                </NavLink>

                <NavLink
                    to="/admin/exchanges"
                    className={({ isActive }) =>
                        isActive
                            ? "admin-sidebar-link active"
                            : "admin-sidebar-link"
                    }
                >
                    Exchanges
                </NavLink>

            </nav>

            <div className="admin-sidebar-bottom">

                <button
                    className="admin-logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </aside>
    );
};

export default AdminSidebar;