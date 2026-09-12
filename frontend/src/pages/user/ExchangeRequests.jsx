import { useEffect, useState } from "react";

import {
  getSentRequests,
  getReceivedRequests,
  acceptExchangeRequest,
  rejectExchangeRequest,
  cancelExchangeRequest,
} from "../../api/exchangeRequestApi";

function ExchangeRequests() {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const [sent, received] =
        await Promise.all([
          getSentRequests(),
          getReceivedRequests(),
        ]);

      setSentRequests(sent || []);
      setReceivedRequests(received || []);

    } catch (error) {
      console.error(
        "Exchange requests error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load exchange requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      setActionLoading(requestId);
      setError("");

      await acceptExchangeRequest(requestId);

      await loadRequests();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to accept request."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionLoading(requestId);
      setError("");

      await rejectExchangeRequest(requestId);

      await loadRequests();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to reject request."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      setActionLoading(requestId);
      setError("");

      await cancelExchangeRequest(requestId);

      await loadRequests();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to cancel request."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const statusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";

      case "ACCEPTED":
        return "status-accepted";

      case "REJECTED":
        return "status-rejected";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "status-cancelled";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">
          Loading exchange requests...
        </p>
      </div>
    );
  }

  return (
    <div>

      <div className="page-header">
        <h1 className="page-title">
          Exchange Requests
        </h1>

        <p className="page-description">
          Manage your incoming and outgoing skill exchange requests.
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* RECEIVED */}

      <section className="exchange-section">

        <h2 className="exchange-section-title">
          Received Requests
        </h2>

        {receivedRequests.length === 0 ? (
          <div className="empty-request-card">
            You have no received exchange requests.
          </div>
        ) : (
          <div className="exchange-list">

            {receivedRequests.map((request) => (
              <div
                key={request.id}
                className="exchange-request-card"
              >

                <div className="exchange-request-content">

                  <div className="request-user">

                    <h3 className="request-name">
                      {request.senderFirstName}{" "}
                      {request.senderLastName}
                    </h3>

                    <p className="request-username">
                      @{request.senderUsername}
                    </p>

                    <p className="request-description">
                      Wants to learn{" "}
                      <strong>
                        {request.requestedSkillName}
                      </strong>

                      {request.offeredSkillName
                        ? (
                          <>
                            {" "}and offers to teach{" "}
                            <strong>
                              {request.offeredSkillName}
                            </strong>
                          </>
                        )
                        : " without offering a skill in return."
                      }
                    </p>

                  </div>

                  <div className="request-actions">

                    <span
                      className={`status-badge ${statusClass(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>

                    {request.status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            handleAccept(request.id)
                          }
                          disabled={
                            actionLoading === request.id
                          }
                          className="request-button request-accept"
                        >
                          {actionLoading === request.id
                            ? "Processing..."
                            : "Accept"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleReject(request.id)
                          }
                          disabled={
                            actionLoading === request.id
                          }
                          className="request-button request-reject"
                        >
                          Reject
                        </button>
                      </>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

      {/* SENT */}

      <section className="exchange-section">

        <h2 className="exchange-section-title">
          Sent Requests
        </h2>

        {sentRequests.length === 0 ? (
          <div className="empty-request-card">
            You have not sent any exchange requests.
          </div>
        ) : (
          <div className="exchange-list">

            {sentRequests.map((request) => (
              <div
                key={request.id}
                className="exchange-request-card"
              >

                <div className="exchange-request-content">

                  <div className="request-user">

                    <h3 className="request-name">
                      {request.receiverFirstName}{" "}
                      {request.receiverLastName}
                    </h3>

                    <p className="request-username">
                      @{request.receiverUsername}
                    </p>

                    <p className="request-description">
                      You want to learn{" "}
                      <strong>
                        {request.requestedSkillName}
                      </strong>

                      {request.offeredSkillName
                        ? (
                          <>
                            {" "}and offered to teach{" "}
                            <strong>
                              {request.offeredSkillName}
                            </strong>
                          </>
                        )
                        : " without offering a skill in return."
                      }
                    </p>

                  </div>

                  <div className="request-actions">

                    <span
                      className={`status-badge ${statusClass(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>

                    {request.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCancel(request.id)
                        }
                        disabled={
                          actionLoading === request.id
                        }
                        className="request-button request-cancel"
                      >
                        {actionLoading === request.id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default ExchangeRequests;