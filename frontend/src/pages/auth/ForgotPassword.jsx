import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await forgotPassword({ email });

      localStorage.setItem("resetEmail", email);

      navigate("/verify-reset-otp");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to process request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Enter your email to reset your password
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

        </form>

        <p className="text-center mt-6">
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;