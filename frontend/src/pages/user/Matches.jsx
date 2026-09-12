import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMatches } from "../../api/matchApi";
import MatchCard from "../../components/MatchCard";

function Matches() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMatches();

        setMatches(data || []);
      } catch (error) {
        console.error("Matches error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load matches."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  const handleViewProfile = (userId) => {
    navigate(`/users/${userId}/profile`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">
          Finding your best matches...
        </p>
      </div>
    );
  }

  return (
    <div>

      <div className="matches-header">

        <h1 className="page-title">
          Find Matches
        </h1>

        <p className="page-description">
          Discover users whose skills match what you want to learn.
        </p>

      </div>

      {error ? (
        <div className="error-message">
          {error}
        </div>
      ) : matches.length === 0 ? (
        <div className="no-matches">

          <h2 className="no-matches-title">
            No matches found
          </h2>

          <p className="no-matches-text">
            Add some learning skills to find
            people who can teach you.
          </p>

          <button
            type="button"
            onClick={() => navigate("/skills")}
            className="no-matches-button"
          >
            Add Learning Skills
          </button>

        </div>
      ) : (
        <>
          <div className="matches-count">
            Found{" "}
            <strong>
              {matches.length}
            </strong>{" "}
            {matches.length === 1
              ? "match"
              : "matches"}
          </div>

          <div className="matches-grid">

            {matches.map((match) => (
              <MatchCard
                key={match.userId}
                match={match}
                onViewProfile={
                  handleViewProfile
                }
              />
            ))}

          </div>
        </>
      )}

    </div>
  );
}

export default Matches;