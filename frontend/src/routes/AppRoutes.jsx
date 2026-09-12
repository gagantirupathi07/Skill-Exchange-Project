import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyResetOtp from "../pages/auth/VerifyResetOtp";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/user/Dashboard";
import Skills from "../pages/user/Skills";
import Matches from "../pages/user/Matches";
import Profile from "../pages/user/Profile";
import PublicProfile from "../pages/user/PublicProfile";
import ExchangeRequests from "../pages/user/ExchangeRequests";
import MyExchanges from "../pages/user/MyExchanges";
import Credits from "../pages/user/Credits";

import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

/* =========================
   ADMIN IMPORTS
   ========================= */

import AdminRoute from "./AdminRoute";

import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminSkills from "../pages/admin/AdminSkills";
import AdminExchanges from "../pages/admin/AdminExchanges";


function AppRoutes() {
  return (
    <Routes>

      {/* =========================
          PUBLIC ROUTES
          ========================= */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/verify-otp"
        element={<VerifyOtp />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/verify-reset-otp"
        element={<VerifyResetOtp />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* =========================
          USER DASHBOARD
          ========================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =========================
          USER SKILLS
          ========================= */}

      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <Layout>
              <Skills />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =========================
          USER PROFILE
          ========================= */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =========================
          USER MATCHES
          ========================= */}

      <Route
        path="/matches"
        element={
          <ProtectedRoute>
            <Layout>
              <Matches />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =========================
          PUBLIC USER PROFILE
          ========================= */}

      <Route
        path="/users/:id/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <PublicProfile />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =========================
          EXCHANGE REQUESTS
          ========================= */}

      <Route
        path="/exchange-requests"
        element={
          <ProtectedRoute>
            <Layout>
              <ExchangeRequests />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =========================
          MY EXCHANGES
          ========================= */}

      <Route
        path="/my-exchanges"
        element={
          <ProtectedRoute>
            <Layout>
              <MyExchanges />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =========================
          CREDITS
          ========================= */}

      <Route
        path="/credits"
        element={
          <ProtectedRoute>
            <Layout>
              <Credits />
            </Layout>
          </ProtectedRoute>
        }
      />


      {/* =========================
          ADMIN ROUTES
          ========================= */}

      <Route element={<AdminRoute />}>

        <Route element={<AdminLayout />}>

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/skills"
            element={<AdminSkills />}
          />

          <Route
            path="/admin/exchanges"
            element={<AdminExchanges />}
          />

        </Route>

      </Route>


      {/* =========================
          UNKNOWN ROUTES
          ========================= */}

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}

export default AppRoutes;