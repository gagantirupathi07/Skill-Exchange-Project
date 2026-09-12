import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const initials =
    user?.firstName?.charAt(0) ||
    user?.username?.charAt(0) ||
    "U";

  return (
    <div>

      <div className="page-header">
        <h1 className="page-title">
          My Profile
        </h1>

        <p className="page-description">
          View your account information.
        </p>
      </div>

      <div className="profile-card">

        <div className="profile-header">

          <div className="profile-avatar">
            {initials.toUpperCase()}
          </div>

          <div>
            <h2 className="profile-name">
              {user?.firstName || "User"}{" "}
              {user?.lastName || ""}
            </h2>

            <p className="profile-username">
              @{user?.username || "user"}
            </p>
          </div>

        </div>

        <div className="profile-details">

          <div className="profile-field">
            <p className="profile-label">
              Username
            </p>

            <p className="profile-value">
              {user?.username || "—"}
            </p>
          </div>

          <div className="profile-field">
            <p className="profile-label">
              Email
            </p>

            <p className="profile-value">
              {user?.email || "—"}
            </p>
          </div>

          <div className="profile-field">
            <p className="profile-label">
              First Name
            </p>

            <p className="profile-value">
              {user?.firstName || "—"}
            </p>
          </div>

          <div className="profile-field">
            <p className="profile-label">
              Last Name
            </p>

            <p className="profile-value">
              {user?.lastName || "—"}
            </p>
          </div>

          <div className="profile-field">
            <p className="profile-label">
              Phone
            </p>

            <p className="profile-value">
              {user?.phone || "—"}
            </p>
          </div>

          <div className="profile-field profile-bio">
            <p className="profile-label">
              Bio
            </p>

            <p className="profile-value">
              {user?.bio || "No bio added."}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;