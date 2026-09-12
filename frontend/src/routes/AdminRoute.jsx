import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(storedUser);
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }

    if (user.role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;