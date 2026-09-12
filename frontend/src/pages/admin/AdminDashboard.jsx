import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { getAdminDashboard } from "../../api/adminDashboardApi";

const STATUS_COLORS = {
    active: "#3b82f6",
    completed: "#22c55e",
    pending: "#f59e0b",
    rejected: "#ef4444",
    cancelled: "#6b7280",
    inactive: "#ef4444",
    scheduled: "#3b82f6",
};

const AdminDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await getAdminDashboard();
                setDashboard(data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load admin dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-page-header">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Loading platform overview...</p>
                    </div>
                </div>

                <div className="admin-card-grid">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            className="admin-stat-card admin-loading-card"
                            key={item}
                        >
                            <div className="admin-skeleton admin-skeleton-small"></div>
                            <div className="admin-skeleton admin-skeleton-large"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-page">

                <div className="admin-page-header">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Unable to load platform information.</p>
                    </div>
                </div>

                <div className="admin-error">
                    {error}
                </div>

            </div>
        );
    }

    const userStatusData = [
        {
            name: "Active",
            value: dashboard.activeUsers,
            color: STATUS_COLORS.active,
        },
        {
            name: "Inactive",
            value: dashboard.inactiveUsers,
            color: STATUS_COLORS.inactive,
        },
        {
            name: "Pending",
            value: dashboard.pendingUsers,
            color: STATUS_COLORS.pending,
        },
    ];

    const exchangeRequestData = [
        {
            name: "Pending",
            value: dashboard.pendingExchangeRequests,
            color: STATUS_COLORS.pending,
        },
        {
            name: "Accepted",
            value: dashboard.acceptedExchangeRequests,
            color: STATUS_COLORS.completed,
        },
        {
            name: "Rejected",
            value: dashboard.rejectedExchangeRequests,
            color: STATUS_COLORS.rejected,
        },
        {
            name: "Cancelled",
            value: dashboard.cancelledExchangeRequests,
            color: STATUS_COLORS.cancelled,
        },
    ];

    const exchangeStatusData = [
        {
            name: "Active",
            value: dashboard.activeExchanges,
            color: STATUS_COLORS.active,
        },
        {
            name: "Completed",
            value: dashboard.completedExchanges,
            color: STATUS_COLORS.completed,
        },
        {
            name: "Cancelled",
            value: dashboard.cancelledExchanges,
            color: STATUS_COLORS.cancelled,
        },
    ];

    const sessionStatusData = [
        {
            name: "Scheduled",
            value: dashboard.scheduledSessions,
            color: STATUS_COLORS.scheduled,
        },
        {
            name: "Completed",
            value: dashboard.completedSessions,
            color: STATUS_COLORS.completed,
        },
        {
            name: "Cancelled",
            value: dashboard.cancelledSessions,
            color: STATUS_COLORS.cancelled,
        },
    ];

    return (
        <div className="admin-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="admin-page-header">

                <div>
                    <h1>Admin Dashboard</h1>

                    <p>
                        Overview of your Skill Exchange platform.
                    </p>
                </div>

            </div>


            {/* =========================
                OVERVIEW CARDS
            ========================= */}

            <section className="admin-overview-grid">

                <div className="admin-overview-card">

                    <div className="admin-overview-icon users-icon">
                        👥
                    </div>

                    <div className="admin-overview-content">

                        <span>Total Users</span>

                        <strong>
                            {dashboard.totalUsers}
                        </strong>

                        <small>
                            {dashboard.activeUsers} active users
                        </small>

                    </div>

                </div>


                <div className="admin-overview-card">

                    <div className="admin-overview-icon exchange-icon">
                        ⇄
                    </div>

                    <div className="admin-overview-content">

                        <span>Total Exchanges</span>

                        <strong>
                            {dashboard.totalExchanges}
                        </strong>

                        <small>
                            {dashboard.activeExchanges} active exchanges
                        </small>

                    </div>

                </div>


                <div className="admin-overview-card">

                    <div className="admin-overview-icon session-icon">
                        ◷
                    </div>

                    <div className="admin-overview-content">

                        <span>Total Sessions</span>

                        <strong>
                            {dashboard.totalSessions}
                        </strong>

                        <small>
                            {dashboard.scheduledSessions} scheduled
                        </small>

                    </div>

                </div>


                <div className="admin-overview-card">

                    <div className="admin-overview-icon credit-icon">
                        ◉
                    </div>

                    <div className="admin-overview-content">

                        <span>Credits in Wallets</span>

                        <strong>
                            {dashboard.totalCreditsInWallets}
                        </strong>

                        <small>
                            Platform credit balance
                        </small>

                    </div>

                </div>

            </section>


            {/* =========================
                USERS
            ========================= */}

            <section className="admin-section">

                <div className="admin-section-header">

                    <div>
                        <h2>Users</h2>

                        <p>
                            Current user account distribution.
                        </p>
                    </div>

                </div>


                <div className="admin-card-grid">

                    <div className="admin-stat-card">
                        <span>Total Users</span>

                        <strong>
                            {dashboard.totalUsers}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Active Users</span>

                        <strong className="admin-value-success">
                            {dashboard.activeUsers}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Pending Users</span>

                        <strong className="admin-value-warning">
                            {dashboard.pendingUsers}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Inactive Users</span>

                        <strong className="admin-value-danger">
                            {dashboard.inactiveUsers}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Admin Users</span>

                        <strong>
                            {dashboard.adminUsers}
                        </strong>
                    </div>

                </div>

            </section>


            {/* =========================
                USER STATUS
            ========================= */}

            <section className="admin-section">

                <div className="admin-chart-grid">

                    <div className="admin-chart-card">

                        <div className="admin-chart-header">
                            <div>
                                <h2>User Status</h2>

                                <p>
                                    Distribution of user accounts.
                                </p>
                            </div>
                        </div>

                        <div className="admin-chart-container">

                            <ResponsiveContainer
                                width="100%"
                                height={350}
                            >

                                <PieChart>

                                    <Pie
                                        data={userStatusData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="45%"
                                        outerRadius={110}
                                        label={false}
                                    >

                                        {userStatusData.map((entry) => (
                                            <Cell
                                                key={entry.name}
                                                fill={entry.color}
                                            />
                                        ))}

                                    </Pie>

                                    <Tooltip />

                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        </div>

                    </div>


                    {/* USER SUMMARY */}

                    <div className="admin-summary-card">

                        <div className="admin-chart-header">
                            <div>
                                <h2>User Summary</h2>

                                <p>
                                    Platform account overview.
                                </p>
                            </div>
                        </div>

                        <div className="admin-summary-list">

                            <div className="admin-summary-item">

                                <div>
                                    <span className="status-dot active-dot"></span>
                                    Active Users
                                </div>

                                <strong>
                                    {dashboard.activeUsers}
                                </strong>

                            </div>


                            <div className="admin-summary-item">

                                <div>
                                    <span className="status-dot pending-dot"></span>
                                    Pending Users
                                </div>

                                <strong>
                                    {dashboard.pendingUsers}
                                </strong>

                            </div>


                            <div className="admin-summary-item">

                                <div>
                                    <span className="status-dot inactive-dot"></span>
                                    Inactive Users
                                </div>

                                <strong>
                                    {dashboard.inactiveUsers}
                                </strong>

                            </div>


                            <div className="admin-summary-item">

                                <div>
                                    <span className="status-dot admin-dot"></span>
                                    Administrators
                                </div>

                                <strong>
                                    {dashboard.adminUsers}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                SKILLS
            ========================= */}

            <section className="admin-section">

                <div className="admin-section-header">

                    <div>
                        <h2>Skills</h2>

                        <p>
                            Skills available across the platform.
                        </p>
                    </div>

                </div>


                <div className="admin-card-grid">

                    <div className="admin-stat-card">
                        <span>Total Skills</span>

                        <strong>
                            {dashboard.totalSkills}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Active Skills</span>

                        <strong className="admin-value-success">
                            {dashboard.activeSkills}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Inactive Skills</span>

                        <strong className="admin-value-danger">
                            {dashboard.inactiveSkills}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Teaching Entries</span>

                        <strong>
                            {dashboard.totalTeachingSkillEntries}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Learning Entries</span>

                        <strong>
                            {dashboard.totalLearningSkillEntries}
                        </strong>
                    </div>

                </div>

            </section>


            {/* =========================
                EXCHANGE REQUESTS
            ========================= */}

            <section className="admin-section">

                <div className="admin-section-header">

                    <div>
                        <h2>Exchange Requests</h2>

                        <p>
                            Monitor the request lifecycle.
                        </p>
                    </div>

                </div>


                <div className="admin-card-grid">

                    <div className="admin-stat-card">
                        <span>Total Requests</span>

                        <strong>
                            {dashboard.totalExchangeRequests}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Pending</span>

                        <strong className="admin-value-warning">
                            {dashboard.pendingExchangeRequests}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Accepted</span>

                        <strong className="admin-value-success">
                            {dashboard.acceptedExchangeRequests}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Rejected</span>

                        <strong className="admin-value-danger">
                            {dashboard.rejectedExchangeRequests}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Cancelled</span>

                        <strong>
                            {dashboard.cancelledExchangeRequests}
                        </strong>
                    </div>

                </div>

            </section>


            {/* =========================
                EXCHANGE REQUEST CHART
            ========================= */}

            <section className="admin-section">

                <div className="admin-chart-card">

                    <div className="admin-chart-header">

                        <div>
                            <h2>Exchange Request Status</h2>

                            <p>
                                Current distribution of exchange requests.
                            </p>
                        </div>

                    </div>

                    <div className="admin-chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <BarChart
                                data={exchangeRequestData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis
                                    allowDecimals={false}
                                />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="value"
                                    name="Requests"
                                >

                                    {exchangeRequestData.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={entry.color}
                                        />
                                    ))}

                                </Bar>

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </section>


            {/* =========================
                EXCHANGES
            ========================= */}

            <section className="admin-section">

                <div className="admin-section-header">

                    <div>
                        <h2>Exchanges</h2>

                        <p>
                            Monitor active and completed exchanges.
                        </p>
                    </div>

                </div>


                <div className="admin-card-grid">

                    <div className="admin-stat-card">
                        <span>Total Exchanges</span>

                        <strong>
                            {dashboard.totalExchanges}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Active</span>

                        <strong className="admin-value-info">
                            {dashboard.activeExchanges}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Completed</span>

                        <strong className="admin-value-success">
                            {dashboard.completedExchanges}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Cancelled</span>

                        <strong className="admin-value-danger">
                            {dashboard.cancelledExchanges}
                        </strong>
                    </div>

                </div>

            </section>


            {/* =========================
                EXCHANGE STATUS CHART
            ========================= */}

            <section className="admin-section">

                <div className="admin-chart-card">

                    <div className="admin-chart-header">

                        <div>
                            <h2>Exchange Status</h2>

                            <p>
                                Current state of platform exchanges.
                            </p>
                        </div>

                    </div>

                    <div className="admin-chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <BarChart
                                data={exchangeStatusData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis
                                    allowDecimals={false}
                                />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="value"
                                    name="Exchanges"
                                >

                                    {exchangeStatusData.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={entry.color}
                                        />
                                    ))}

                                </Bar>

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </section>


            {/* =========================
                SESSIONS
            ========================= */}

            <section className="admin-section">

                <div className="admin-section-header">

                    <div>
                        <h2>Sessions</h2>

                        <p>
                            Monitor scheduled and completed learning sessions.
                        </p>
                    </div>

                </div>


                <div className="admin-card-grid">

                    <div className="admin-stat-card">
                        <span>Total Sessions</span>

                        <strong>
                            {dashboard.totalSessions}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Scheduled</span>

                        <strong className="admin-value-info">
                            {dashboard.scheduledSessions}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Completed</span>

                        <strong className="admin-value-success">
                            {dashboard.completedSessions}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Cancelled</span>

                        <strong className="admin-value-danger">
                            {dashboard.cancelledSessions}
                        </strong>
                    </div>

                </div>

            </section>


            {/* =========================
                SESSION STATUS CHART
            ========================= */}

            <section className="admin-section">

                <div className="admin-chart-card">

                    <div className="admin-chart-header">

                        <div>
                            <h2>Session Status</h2>

                            <p>
                                Current state of learning sessions.
                            </p>
                        </div>

                    </div>

                    <div className="admin-chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <BarChart
                                data={sessionStatusData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis
                                    allowDecimals={false}
                                />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="value"
                                    name="Sessions"
                                >

                                    {sessionStatusData.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={entry.color}
                                        />
                                    ))}

                                </Bar>

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </section>


            {/* =========================
                CREDITS
            ========================= */}

            <section className="admin-section">

                <div className="admin-section-header">

                    <div>
                        <h2>Credits</h2>

                        <p>
                            Overview of the platform credit economy.
                        </p>
                    </div>

                </div>


                <div className="admin-card-grid">

                    <div className="admin-stat-card">
                        <span>Credits in Wallets</span>

                        <strong>
                            {dashboard.totalCreditsInWallets}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Total Earned</span>

                        <strong className="admin-value-success">
                            {dashboard.totalCreditsEarned}
                        </strong>
                    </div>

                    <div className="admin-stat-card">
                        <span>Total Spent</span>

                        <strong className="admin-value-info">
                            {dashboard.totalCreditsSpent}
                        </strong>
                    </div>

                </div>

            </section>

        </div>
    );
};

export default AdminDashboard;