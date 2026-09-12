import { useEffect, useState } from "react";
import { getDashboard } from "../../api/dashboardApi";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const data = await getDashboard();

        console.log("Dashboard response:", data);

        setDashboard(data);
      } catch (error) {
        console.error("Dashboard error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  const firstName =
    dashboard?.firstName ||
    user?.firstName ||
    user?.username ||
    "User";

  return (
    <div>

      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome, {firstName}!
        </h1>

        <p className="dashboard-description">
          Manage your skills, exchanges and credits from here.
        </p>
      </div>

      <div className="dashboard-stats">

        <div className="stat-card">
          <span className="stat-label">
            Credit Balance
          </span>

          <h2 className="stat-value stat-blue">
            {dashboard?.creditBalance ?? 0}
          </h2>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Active Exchanges
          </span>

          <h2 className="stat-value stat-green">
            {dashboard?.activeExchangeCount ?? 0}
          </h2>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Pending Requests
          </span>

          <h2 className="stat-value stat-yellow">
            {dashboard?.pendingReceivedRequestCount ?? 0}
          </h2>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Completed Exchanges
          </span>

          <h2 className="stat-value stat-purple">
            {dashboard?.completedExchangeCount ?? 0}
          </h2>
        </div>

      </div>

      <div className="dashboard-skills">

        <div className="dashboard-skill-card">

          <h2 className="dashboard-section-title">
            My Teaching Skills
          </h2>

          {dashboard?.teachingSkills?.length > 0 ? (
            <div className="skill-pills">

              {dashboard.teachingSkills.map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="skill-pill skill-pill-blue"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>
          ) : (
            <p className="empty-text">
              No teaching skills added yet.
            </p>
          )}

        </div>

        <div className="dashboard-skill-card">

          <h2 className="dashboard-section-title">
            My Learning Skills
          </h2>

          {dashboard?.learningSkills?.length > 0 ? (
            <div className="skill-pills">

              {dashboard.learningSkills.map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="skill-pill skill-pill-green"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>
          ) : (
            <p className="empty-text">
              No learning skills added yet.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;