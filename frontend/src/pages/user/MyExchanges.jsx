import { useEffect, useState } from "react";
import {
  getMyExchanges,
  completeExchange,
} from "../../api/exchangeApi";
import {
  getExchangeSessions,
} from "../../api/exchangeSessionApi";
import ScheduleSessionModal from "./ScheduleSessionModal";

function MyExchanges() {
  const [exchanges, setExchanges] = useState([]);

  const [sessions, setSessions] = useState({});

  const [loading, setLoading] = useState(true);

  const [completingId, setCompletingId] =
    useState(null);

  const [scheduleExchange, setScheduleExchange] =
    useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const loadExchanges = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyExchanges();

      const exchangeList = data || [];

      setExchanges(exchangeList);

      /*
       * Load sessions for every exchange.
       *
       * Each exchange has its own session endpoint.
       */
      const sessionResults =
        await Promise.all(
          exchangeList.map(async (exchange) => {
            try {
              const exchangeSessions =
                await getExchangeSessions(
                  exchange.id
                );

              return {
                exchangeId: exchange.id,
                sessions:
                  exchangeSessions || [],
              };
            } catch (err) {
              console.error(
                `Error loading sessions for exchange ${exchange.id}:`,
                err
              );

              return {
                exchangeId: exchange.id,
                sessions: [],
              };
            }
          })
        );

      const sessionMap = {};

      sessionResults.forEach((result) => {
        sessionMap[result.exchangeId] =
          result.sessions;
      });

      setSessions(sessionMap);

    } catch (err) {
      console.error(
        "Error loading exchanges:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to load exchanges."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExchanges();
  }, []);

  const handleComplete = async (exchangeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this exchange as completed?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCompletingId(exchangeId);
      setError("");
      setSuccess("");

      const response =
        await completeExchange(exchangeId);

      setSuccess(
        response?.message ||
          "Exchange completed successfully."
      );

      await loadExchanges();

    } catch (err) {
      console.error(
        "Error completing exchange:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to complete exchange."
      );
    } finally {
      setCompletingId(null);
    }
  };

  const handleScheduleSuccess = (
    exchangeId,
    newSession
  ) => {
    setSessions((previous) => ({
      ...previous,

      [exchangeId]: [
        ...(previous[exchangeId] || []),
        newSession,
      ],
    }));

    setSuccess(
      "Session scheduled successfully."
    );

    setError("");
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    /*
     * Add T00:00:00 so the date is interpreted
     * as local time instead of UTC.
     */
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const formatTime = (time) => {
    if (!time) {
      return "—";
    }

    /*
     * Spring LocalTime normally returns:
     * "10:00:00"
     *
     * We attach a dummy date so JavaScript
     * can format it nicely.
     */
    return new Date(
      `1970-01-01T${time}`
    ).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSessionStatusClasses = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCurrentUserRole = (exchange) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return "PARTICIPANT";
    }

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      const username =
        payload.sub ||
        payload.username ||
        "";

      if (
        exchange.teacherUsername === username
      ) {
        return "TEACHER";
      }

      if (
        exchange.learnerUsername === username
      ) {
        return "LEARNER";
      }

      return "PARTICIPANT";

    } catch (err) {
      console.error(
        "Unable to read token:",
        err
      );

      return "PARTICIPANT";
    }
  };

  /*
   * Get sessions for one exchange.
   */
  const getSessionsForExchange = (
    exchangeId
  ) => {
    return sessions[exchangeId] || [];
  };

  /*
   * Find the currently scheduled session.
   *
   * Backend allows another session after a
   * previous session is COMPLETED or CANCELLED.
   */
  const getScheduledSession = (exchangeId) => {
    const exchangeSessions =
      getSessionsForExchange(exchangeId);

    return exchangeSessions.find(
      (session) =>
        session.status === "SCHEDULED"
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-gray-500">
            Loading your exchanges...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Exchanges
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your active and completed skill
          learning exchanges.
        </p>
      </div>


      {/* Success Message */}

      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}


      {/* Error Message */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* Statistics */}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Exchanges
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {exchanges.length}
          </p>
        </div>


        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Active
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {
              exchanges.filter(
                (exchange) =>
                  exchange.status === "ACTIVE"
              ).length
            }
          </p>
        </div>


        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {
              exchanges.filter(
                (exchange) =>
                  exchange.status === "COMPLETED"
              ).length
            }
          </p>
        </div>

      </div>


      {/* Empty State */}

      {exchanges.length === 0 ? (

        <div className="rounded-xl bg-white p-12 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <span className="text-2xl">
              ↔
            </span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            No exchanges yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Once an exchange request is accepted,
            your exchange will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {exchanges.map((exchange) => {

            const currentRole =
              getCurrentUserRole(exchange);

            const exchangeSessions =
              getSessionsForExchange(
                exchange.id
              );

            const scheduledSession =
              getScheduledSession(
                exchange.id
              );

            return (

              <div
                key={exchange.id}
                className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >

                {/* =========================
                    TOP SECTION
                ========================= */}

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-xl font-bold text-gray-900">
                        {exchange.skillName}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          exchange.status
                        )}`}
                      >
                        {exchange.status}
                      </span>

                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                        {currentRole}
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Exchange #{exchange.id}
                    </p>

                  </div>


                  {/* Credit */}

                  <div className="rounded-lg bg-yellow-50 px-4 py-3 text-center">

                    <p className="text-xs font-medium text-yellow-700">
                      Credits
                    </p>

                    <p className="text-lg font-bold text-yellow-800">
                      {exchange.creditAmount ??
                        "5.00"}
                    </p>

                  </div>

                </div>


                {/* =========================
                    PARTICIPANTS
                ========================= */}

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* Teacher */}

                  <div className="rounded-lg bg-gray-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Teacher
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">

                      {exchange.teacherFirstName ||
                        exchange.teacherLastName
                        ? `${exchange.teacherFirstName || ""} ${
                            exchange.teacherLastName || ""
                          }`.trim()
                        : exchange.teacherUsername}

                    </p>

                    <p className="text-sm text-gray-500">
                      @{exchange.teacherUsername}
                    </p>

                  </div>


                  {/* Learner */}

                  <div className="rounded-lg bg-gray-50 p-4">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Learner
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">

                      {exchange.learnerFirstName ||
                        exchange.learnerLastName
                        ? `${exchange.learnerFirstName || ""} ${
                            exchange.learnerLastName || ""
                          }`.trim()
                        : exchange.learnerUsername}

                    </p>

                    <p className="text-sm text-gray-500">
                      @{exchange.learnerUsername}
                    </p>

                  </div>

                </div>


                {/* =========================
                    EXCHANGE INFORMATION
                ========================= */}

                <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">

                  <div>

                    <p className="text-xs font-medium text-gray-500">
                      Started
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(
                        exchange.startedAt
                      )}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs font-medium text-gray-500">
                      Created
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(
                        exchange.createdAt
                      )}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs font-medium text-gray-500">
                      Completed
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(
                        exchange.completedAt
                      )}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs font-medium text-gray-500">
                      Last Updated
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDateTime(
                        exchange.updatedAt
                      )}
                    </p>

                  </div>

                </div>


                {/* =========================
                    SESSION SECTION
                ========================= */}

                <div className="mt-6 border-t border-gray-100 pt-6">

                  <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                    <div>

                      <h3 className="text-lg font-semibold text-gray-900">
                        Learning Sessions
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Sessions scheduled for this exchange.
                      </p>

                    </div>


                    {/* Schedule Button */}

                    {exchange.status === "ACTIVE" &&
                      currentRole === "TEACHER" &&
                      !scheduledSession && (

                        <button
                          type="button"
                          onClick={() =>
                            setScheduleExchange(
                              exchange
                            )
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Schedule Session
                        </button>

                      )}

                  </div>


                  {/* No Session */}

                  {exchangeSessions.length === 0 ? (

                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5">

                      {exchange.status ===
                        "ACTIVE" &&
                      currentRole ===
                        "TEACHER" ? (

                        <div>

                          <p className="font-medium text-gray-800">
                            No session scheduled yet.
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Schedule a learning session
                            for the learner.
                          </p>

                        </div>

                      ) : exchange.status ===
                        "ACTIVE" &&
                        currentRole ===
                          "LEARNER" ? (

                        <div>

                          <p className="font-medium text-gray-800">
                            No session scheduled yet.
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Waiting for the teacher to
                            schedule the learning session.
                          </p>

                        </div>

                      ) : (

                        <p className="text-sm text-gray-500">
                          No sessions were scheduled
                          for this exchange.
                        </p>

                      )}

                    </div>

                  ) : (

                    <div className="space-y-4">

                      {exchangeSessions.map(
                        (session) => (

                          <div
                            key={session.id}
                            className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                          >

                            {/* Session Header */}

                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

                              <div>

                                <div className="flex flex-wrap items-center gap-3">

                                  <h4 className="font-semibold text-gray-900">
                                    Session #{session.id}
                                  </h4>

                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getSessionStatusClasses(
                                      session.status
                                    )}`}
                                  >
                                    {session.status}
                                  </span>

                                </div>

                              </div>

                              <div className="text-sm text-gray-500">
                                {session.meetingPlatform}
                              </div>

                            </div>


                            {/* Date + Time */}

                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

                              <div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Date
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                  {formatDate(
                                    session.scheduledDate
                                  )}
                                </p>

                              </div>


                              <div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Time
                                </p>

                                <p className="mt-1 font-medium text-gray-900">

                                  {formatTime(
                                    session.startTime
                                  )}

                                  {" - "}

                                  {formatTime(
                                    session.endTime
                                  )}

                                </p>

                              </div>


                              <div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Duration
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                  {session.durationMinutes}{" "}
                                  minutes
                                </p>

                              </div>

                            </div>


                            {/* Meeting Link */}

                            <div className="mt-5">

                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Meeting
                              </p>

                              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">

                                <a
                                  href={
                                    session.meetingLink
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                  Join Meeting
                                </a>

                                <span className="break-all text-sm text-gray-500">
                                  {
                                    session.meetingLink
                                  }
                                </span>

                              </div>

                            </div>


                            {/* Notes */}

                            {session.notes && (

                              <div className="mt-5">

                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Notes
                                </p>

                                <p className="mt-1 rounded-lg bg-white p-3 text-sm text-gray-700">
                                  {session.notes}
                                </p>

                              </div>

                            )}


                            {/* Created */}

                            <div className="mt-5 border-t border-gray-200 pt-4">

                              <p className="text-xs text-gray-500">
                                Scheduled on{" "}

                                <span className="font-medium text-gray-700">
                                  {formatDateTime(
                                    session.createdAt
                                  )}
                                </span>
                              </p>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}


                  {/* Learner waiting when scheduled */}

                  {exchange.status === "ACTIVE" &&
                    currentRole === "LEARNER" &&
                    scheduledSession && (

                      <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">

                        Your session has been scheduled.
                        Use the meeting link above at the
                        scheduled time.

                      </div>

                    )}

                </div>


                {/* =========================
                    EXCHANGE ACTIONS
                ========================= */}

                {exchange.status === "ACTIVE" &&
                  currentRole === "TEACHER" && (

                    <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">

                      <button
                        type="button"
                        onClick={() =>
                          handleComplete(
                            exchange.id
                          )
                        }
                        disabled={
                          completingId ===
                          exchange.id
                        }
                        className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {completingId ===
                        exchange.id
                          ? "Completing..."
                          : "Mark as Completed"}
                      </button>

                    </div>

                  )}


                {exchange.status === "ACTIVE" &&
                  currentRole === "LEARNER" && (

                    <div className="mt-6 border-t border-gray-100 pt-5">

                      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">

                        You are the learner for this
                        exchange. The teacher must mark
                        the exchange as completed after
                        the learning session.

                      </div>

                    </div>

                  )}


                {exchange.status ===
                  "COMPLETED" && (

                  <div className="mt-6 border-t border-gray-100 pt-5">

                    <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">

                      This exchange has been
                      successfully completed.

                    </div>

                  </div>

                )}

              </div>

            );
          })}

        </div>

      )}


      {/* =========================
          SCHEDULE SESSION MODAL
      ========================= */}

      {scheduleExchange && (

        <ScheduleSessionModal
          exchange={scheduleExchange}

          onClose={() =>
            setScheduleExchange(null)
          }

          onSuccess={(newSession) =>
            handleScheduleSuccess(
              scheduleExchange.id,
              newSession
            )
          }
        />

      )}

    </div>
  );
}

export default MyExchanges;