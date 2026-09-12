import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="app-navbar">

      <div
        className="app-logo"
        onClick={() => navigate("/dashboard")}
      >
        <span className="app-logo-mark">
          S
        </span>

        <span>
          Skill Exchange
        </span>
      </div>

    </nav>
  );
}

export default Navbar;