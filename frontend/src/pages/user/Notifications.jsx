import { useEffect, useState } from "react";
import "../../styles/notifications.css";

import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../api/notificationApi";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const notificationsResponse =
        await getMyNotifications();

      const unreadCountResponse =
        await getUnreadCount();

      setNotifications(notificationsResponse);
      setUnreadCount(unreadCountResponse);
    } catch (err) {
      console.error(
        "Failed to load notifications:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const updatedNotification =
        await markNotificationAsRead(
          notificationId
        );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? updatedNotification
            : notification
        )
      );

      setUnreadCount((currentCount) =>
        currentCount > 0
          ? currentCount - 1
          : 0
      );
    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((currentNotifications) =>
        currentNotifications.map(
          (notification) => ({
            ...notification,
            read: true,
          })
        )
      );

      setUnreadCount(0);
    } catch (err) {
      console.error(
        "Failed to mark all notifications as read:",
        err
      );
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "EXCHANGE_REQUEST_RECEIVED":
        return "📩";

      case "EXCHANGE_REQUEST_ACCEPTED":
        return "✅";

      case "EXCHANGE_REQUEST_REJECTED":
        return "❌";

      case "EXCHANGE_REQUEST_CANCELLED":
        return "🚫";

      case "SESSION_SCHEDULED":
        return "📅";

      case "EXCHANGE_COMPLETED":
        return "🎉";

      case "CREDITS_EARNED":
        return "💰";

      case "CREDITS_SPENT":
        return "💳";

      case "REVIEW_RECEIVED":
        return "⭐";

      case "SESSION_REMINDER":
        return "⏰";

      case "SESSION_COMPLETED":
        return "✔️";

      default:
        return "🔔";
    }
  };

  const getNotificationLabel = (type) => {
    switch (type) {
      case "EXCHANGE_REQUEST_RECEIVED":
        return "Exchange Request";

      case "EXCHANGE_REQUEST_ACCEPTED":
        return "Request Accepted";

      case "EXCHANGE_REQUEST_REJECTED":
        return "Request Rejected";

      case "EXCHANGE_REQUEST_CANCELLED":
        return "Request Cancelled";

      case "SESSION_SCHEDULED":
        return "Session Scheduled";

      case "EXCHANGE_COMPLETED":
        return "Exchange Completed";

      case "CREDITS_EARNED":
        return "Credits Earned";

      case "CREDITS_SPENT":
        return "Credits Spent";

      case "REVIEW_RECEIVED":
        return "Review Received";

      case "SESSION_REMINDER":
        return "Session Reminder";

      case "SESSION_COMPLETED":
        return "Session Completed";

      default:
        return "Notification";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) {
      return "";
    }

    const now = new Date();
    const createdAt = new Date(dateString);

    const difference = Math.floor(
      (now.getTime() - createdAt.getTime()) /
        1000
    );

    if (difference < 60) {
      return "Just now";
    }

    const minutes = Math.floor(
      difference / 60
    );

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days} day${
        days > 1 ? "s" : ""
      } ago`;
    }

    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-loading">
          Loading notifications...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-page">
        <div className="notifications-error">
          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button onClick={loadNotifications}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">

      <div className="notifications-header">

        <div>
          <h1>Notifications</h1>

          <p>
            Stay updated with your skill
            exchanges, sessions and credits.
          </p>
        </div>

        <div className="notifications-header-actions">

          {unreadCount > 0 && (
            <span className="unread-count">
              {unreadCount} unread
            </span>
          )}

          {unreadCount > 0 && (
            <button
              className="mark-all-read-button"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}

        </div>

      </div>

      {notifications.length === 0 ? (

        <div className="notifications-empty">

          <div className="notifications-empty-icon">
            🔔
          </div>

          <h2>No notifications yet</h2>

          <p>
            When something important happens,
            you will see it here.
          </p>

        </div>

      ) : (

        <div className="notifications-list">

          {notifications.map(
            (notification) => (

              <div
                key={notification.id}
                className={`notification-card ${
                  notification.read
                    ? "notification-read"
                    : "notification-unread"
                }`}
                onClick={() => {
                  if (!notification.read) {
                    handleMarkAsRead(
                      notification.id
                    );
                  }
                }}
              >

                <div className="notification-icon">
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>

                <div className="notification-content">

                  <div className="notification-top">

                    <div>

                      <span className="notification-type">
                        {getNotificationLabel(
                          notification.type
                        )}
                      </span>

                      <h3>
                        {notification.title}
                      </h3>

                    </div>

                    {!notification.read && (
                      <span className="unread-dot"></span>
                    )}

                  </div>

                  <p className="notification-message">
                    {notification.message}
                  </p>

                  <div className="notification-bottom">

                    <span
                      className="notification-time"
                      title={formatDate(
                        notification.createdAt
                      )}
                    >
                      {getTimeAgo(
                        notification.createdAt
                      )}
                    </span>

                    {notification.referenceId && (
                      <span className="notification-reference">
                        Reference #
                        {notification.referenceId}
                      </span>
                    )}

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Notifications;