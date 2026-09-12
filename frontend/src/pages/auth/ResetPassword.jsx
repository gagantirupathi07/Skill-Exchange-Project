import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/authApi";

function ResetPassword() {
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");
  const otp = localStorage.getItem("resetOtp");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email,
        otp,
        newPassword: password,
      });

      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOtp");

      setMessage("Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Reset Password
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Create your new password
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New password"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm new password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ResetPassword;