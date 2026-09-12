import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const AdminExchanges = () => {
    const [exchanges, setExchanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [selectedExchange, setSelectedExchange] = useState(null);

    useEffect(() => {
        const loadExchanges = async () => {
            try {
                const response = await api.get("/exchanges/admin");

                setExchanges(response.data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load exchanges"
                );
            } finally {
                setLoading(false);
            }
        };

        loadExchanges();
    }, []);

    const filteredExchanges = useMemo(() => {
        return exchanges.filter((exchange) => {
            const search = searchTerm.toLowerCase().trim();

            const matchesSearch =
                !search ||
                String(exchange.id).includes(search) ||
                exchange.teacherUsername
                    ?.toLowerCase()
                    .includes(search) ||
                exchange.learnerUsername
                    ?.toLowerCase()
                    .includes(search) ||
                exchange.skillName
                    ?.toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === "ALL" ||
                exchange.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [exchanges, searchTerm, statusFilter]);

    const getStatusClass = (status) => {
        switch (status) {
            case "ACTIVE":
                return "admin-status-badge admin-status-active";

            case "COMPLETED":
                return "admin-status-badge admin-status-completed";

            case "CANCELLED":
                return "admin-status-badge admin-status-cancelled";

            default:
                return "admin-status-badge";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString();
    };

    const closeDetails = () => {
        setSelectedExchange(null);
    };

    if (loading) {
        return (
            <div className="admin-page">

                <div className="admin-page-header">
                    <div>
                        <h1>Exchange Monitoring</h1>
                        <p>
                            Loading exchange information...
                        </p>
                    </div>
                </div>

                <div className="admin-table-container">
                    <div className="admin-loading-table">
                        Loading exchanges...
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className="admin-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="admin-page-header">

                <div>
                    <h1>Exchange Monitoring</h1>

                    <p>
                        Monitor exchanges between learners and teachers.
                    </p>
                </div>

                <div className="admin-exchange-count">
                    {filteredExchanges.length} exchanges
                </div>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}


            {/* =========================
                TOOLBAR
            ========================= */}

            <div className="admin-exchange-toolbar">

                <div className="admin-exchange-search">

                    <input
                        type="text"
                        placeholder="Search by ID, teacher, learner or skill..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />

                </div>


                <div className="admin-exchange-filter">

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                    >
                        <option value="ALL">
                            All Statuses
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                        <option value="CANCELLED">
                            Cancelled
                        </option>

                    </select>

                </div>

            </div>


            {/* =========================
                TABLE
            ========================= */}

            <div className="admin-table-container">

                <table className="admin-table admin-exchange-table">

                    <thead>

                    <tr>
                        <th>ID</th>
                        <th>Teacher</th>
                        <th>Learner</th>
                        <th>Skill</th>
                        <th>Credits</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>

                    </thead>


                    <tbody>

                    {filteredExchanges.length === 0 ? (

                        <tr>

                            <td
                                colSpan="8"
                                className="admin-empty-cell"
                            >
                                <div className="admin-empty-state">

                                    <strong>
                                        No exchanges found
                                    </strong>

                                    <span>
                                        Try changing your search or
                                        status filter.
                                    </span>

                                </div>
                            </td>

                        </tr>

                    ) : (

                        filteredExchanges.map((exchange) => (

                            <tr key={exchange.id}>

                                <td>
                                    <span className="admin-exchange-id">
                                        #{exchange.id}
                                    </span>
                                </td>


                                <td>

                                    <div className="admin-person-cell">

                                        <span className="admin-person-avatar">
                                            {exchange.teacherUsername
                                                ?.charAt(0)
                                                ?.toUpperCase() || "T"}
                                        </span>

                                        <div>
                                            <strong>
                                                {exchange.teacherUsername}
                                            </strong>

                                            <small>
                                                Teacher
                                            </small>
                                        </div>

                                    </div>

                                </td>


                                <td>

                                    <div className="admin-person-cell">

                                        <span className="admin-person-avatar">
                                            {exchange.learnerUsername
                                                ?.charAt(0)
                                                ?.toUpperCase() || "L"}
                                        </span>

                                        <div>
                                            <strong>
                                                {exchange.learnerUsername}
                                            </strong>

                                            <small>
                                                Learner
                                            </small>
                                        </div>

                                    </div>

                                </td>


                                <td>

                                    <span className="admin-skill-badge">
                                        {exchange.skillName}
                                    </span>

                                </td>


                                <td>

                                    <strong className="admin-credit-value">
                                        {exchange.creditAmount ?? "0.00"}
                                    </strong>

                                </td>


                                <td>

                                    <span
                                        className={getStatusClass(
                                            exchange.status
                                        )}
                                    >
                                        <span className="admin-status-dot"></span>

                                        {exchange.status}
                                    </span>

                                </td>


                                <td>
                                    {formatDate(exchange.createdAt)}
                                </td>


                                <td>

                                    <button
                                        className="admin-view-button"
                                        onClick={() =>
                                            setSelectedExchange(exchange)
                                        }
                                    >
                                        View
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                    </tbody>

                </table>

            </div>


            {/* =========================
                EXCHANGE DETAILS MODAL
            ========================= */}

            {selectedExchange && (

                <div
                    className="admin-modal-overlay"
                    onClick={closeDetails}
                >

                    <div
                        className="admin-exchange-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="admin-modal-header">

                            <div>

                                <span className="admin-modal-label">
                                    Exchange
                                </span>

                                <h2>
                                    #{selectedExchange.id}
                                </h2>

                            </div>


                            <button
                                className="admin-modal-close"
                                onClick={closeDetails}
                            >
                                ×
                            </button>

                        </div>


                        {/* STATUS */}

                        <div className="admin-modal-status">

                            <span>
                                Current Status
                            </span>

                            <span
                                className={getStatusClass(
                                    selectedExchange.status
                                )}
                            >
                                <span className="admin-status-dot"></span>

                                {selectedExchange.status}
                            </span>

                        </div>


                        {/* PARTICIPANTS */}

                        <div className="admin-detail-section">

                            <h3>
                                Participants
                            </h3>


                            <div className="admin-participant-grid">

                                <div className="admin-participant-card">

                                    <span className="admin-detail-label">
                                        Teacher
                                    </span>

                                    <strong>
                                        {selectedExchange.teacherUsername}
                                    </strong>

                                    <small>
                                        {selectedExchange.teacherName ||
                                            "Skill teacher"}
                                    </small>

                                </div>


                                <div className="admin-participant-card">

                                    <span className="admin-detail-label">
                                        Learner
                                    </span>

                                    <strong>
                                        {selectedExchange.learnerUsername}
                                    </strong>

                                    <small>
                                        {selectedExchange.learnerName ||
                                            "Skill learner"}
                                    </small>

                                </div>

                            </div>

                        </div>


                        {/* EXCHANGE INFORMATION */}

                        <div className="admin-detail-section">

                            <h3>
                                Exchange Information
                            </h3>


                            <div className="admin-detail-grid">

                                <div>
                                    <span className="admin-detail-label">
                                        Skill
                                    </span>

                                    <strong>
                                        {selectedExchange.skillName}
                                    </strong>
                                </div>


                                <div>
                                    <span className="admin-detail-label">
                                        Credit Amount
                                    </span>

                                    <strong>
                                        {selectedExchange.creditAmount ??
                                            "0.00"}
                                    </strong>
                                </div>


                                <div>
                                    <span className="admin-detail-label">
                                        Started
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedExchange.startedAt
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    <span className="admin-detail-label">
                                        Completed
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedExchange.completedAt
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    <span className="admin-detail-label">
                                        Created
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedExchange.createdAt
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    <span className="admin-detail-label">
                                        Last Updated
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedExchange.updatedAt
                                        )}
                                    </strong>
                                </div>

                            </div>

                        </div>


                        {/* LIFECYCLE */}

                        <div className="admin-detail-section">

                            <h3>
                                Exchange Lifecycle
                            </h3>


                            <div className="admin-lifecycle">

                                <div className="admin-lifecycle-item completed">

                                    <span className="admin-lifecycle-circle">
                                        ✓
                                    </span>

                                    <div>
                                        <strong>
                                            Exchange Created
                                        </strong>

                                        <small>
                                            Exchange was created from
                                            an accepted request.
                                        </small>
                                    </div>

                                </div>


                                <div
                                    className={`admin-lifecycle-item ${
                                        selectedExchange.status ===
                                            "COMPLETED"
                                            ? "completed"
                                            : selectedExchange.status ===
                                                "CANCELLED"
                                                ? "cancelled"
                                                : "current"
                                    }`}
                                >

                                    <span className="admin-lifecycle-circle">
                                        {selectedExchange.status ===
                                        "COMPLETED"
                                            ? "✓"
                                            : selectedExchange.status ===
                                                "CANCELLED"
                                                ? "×"
                                                : "•"}
                                    </span>

                                    <div>

                                        <strong>
                                            {selectedExchange.status ===
                                            "COMPLETED"
                                                ? "Exchange Completed"
                                                : selectedExchange.status ===
                                                    "CANCELLED"
                                                    ? "Exchange Cancelled"
                                                    : "Exchange Active"}
                                        </strong>

                                        <small>
                                            Current exchange state.
                                        </small>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* CLOSE */}

                        <div className="admin-modal-footer">

                            <button
                                className="admin-secondary-button"
                                onClick={closeDetails}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AdminExchanges;