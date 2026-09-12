import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getPublicUserProfile } from "../../api/userApi";
import SendExchangeRequestModal from "../../components/SendExchangeRequestModal";

function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRequestModal, setShowRequestModal] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getPublicUserProfile(id);

        setProfile(data);
      } catch (err) {
        console.error(
          "Error fetching public profile:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load user profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleRequestSuccess = () => {
    setShowRequestModal(false);

    setSuccessMessage(
      "Exchange request sent successfully."
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="error-message">
          {error}
        </div>

        <button
          type="button"
          onClick={() => navigate("/matches")}
          className="public-primary-button"
          style={{ marginTop: "14px" }}
        >
          Back to Matches
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="empty-request-card">
        User profile not found.
      </div>
    );
  }

  const teachingSkills =
    profile.teachingSkills || [];

  const learningSkills =
    profile.learningSkills || [];

  const initials =
    profile.firstName?.charAt(0) ||
    profile.username?.charAt(0) ||
    "U";

  return (
    <div className="public-profile-wrapper">

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="public-profile-card">

        <div className="public-profile-header">

          <div className="public-profile-avatar">
            {initials.toUpperCase()}
          </div>

          <div>

            <h1 className="public-profile-name">
              {profile.firstName}{" "}
              {profile.lastName}
            </h1>

            <p className="public-profile-username">
              @{profile.username}
            </p>

          </div>

        </div>

        {profile.bio && (
          <p className="public-profile-bio">
            {profile.bio}
          </p>
        )}

        <div className="public-profile-actions">

          <button
            type="button"
            onClick={() =>
              setShowRequestModal(true)
            }
            className="public-primary-button"
          >
            Send Exchange Request
          </button>

          <button
            type="button"
            onClick={() => navigate("/matches")}
            className="public-secondary-button"
          >
            Back to Matches
          </button>

        </div>

        <section className="public-skill-section">

          <h2 className="public-skill-title">
            Skills They Can Teach
          </h2>

          {teachingSkills.length > 0 ? (
            <div className="public-skill-list">

              {teachingSkills.map((skill) => (
                <span
                  key={
                    skill.id ??
                    skill.skillId ??
                    skill.skill?.id
                  }
                  className="public-skill public-skill-teach"
                >
                  {skill.skillName ??
                    skill.name ??
                    skill.skill?.name}
                </span>
              ))}

            </div>
          ) : (
            <p className="empty-text">
              No teaching skills listed.
            </p>
          )}

        </section>

        <section className="public-skill-section">

          <h2 className="public-skill-title">
            Skills They Want To Learn
          </h2>

          {learningSkills.length > 0 ? (
            <div className="public-skill-list">

              {learningSkills.map((skill) => (
                <span
                  key={
                    skill.id ??
                    skill.skillId ??
                    skill.skill?.id
                  }
                  className="public-skill public-skill-learn"
                >
                  {skill.skillName ??
                    skill.name ??
                    skill.skill?.name}
                </span>
              ))}

            </div>
          ) : (
            <p className="empty-text">
              No learning skills listed.
            </p>
          )}

        </section>

      </div>

      {showRequestModal && (
        <SendExchangeRequestModal
          receiver={{
            userId:
              profile.id ??
              profile.userId ??
              Number(id),

            username:
              profile.username,

            teachingSkills:
              teachingSkills,
          }}
          onClose={() =>
            setShowRequestModal(false)
          }
          onSuccess={
            handleRequestSuccess
          }
        />
      )}

    </div>
  );
}

export default PublicProfile;