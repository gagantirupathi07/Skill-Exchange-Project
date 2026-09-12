import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyResetOtp } from "../../api/authApi";

function VerifyResetOtp() {
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await verifyResetOtp({
        email,
        otp,
      });

      localStorage.setItem("resetOtp", otp);

      navigate("/reset-password");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Verify Reset OTP
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Enter the OTP sent to
          <br />
          <span className="font-semibold text-gray-700">
            {email}
          </span>
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            className="w-full border rounded-lg px-4 py-3 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter OTP"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default VerifyResetOtp;