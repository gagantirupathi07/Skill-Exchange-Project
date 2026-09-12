import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "My Profile",
      path: "/profile",
    },
    {
      name: "Skills",
      path: "/skills",
    },
    {
      name: "Find Matches",
      path: "/matches",
    },
    {
      name: "Exchange Requests",
      path: "/exchange-requests",
    },
    {
      name: "My Exchanges",
      path: "/my-exchanges",
    },
    {
      name: "Credits",
      path: "/credits",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="app-sidebar">

      <div className="sidebar-heading">
        Navigation
      </div>

      <nav className="sidebar-navigation">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {item.name}
          </NavLink>
        ))}

      </nav>

      <div className="sidebar-bottom">

        <button
          type="button"
          className="sidebar-profile"
          onClick={() => navigate("/profile")}
        >
          {user?.firstName ||
            user?.username ||
            "Karthik"}
        </button>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;