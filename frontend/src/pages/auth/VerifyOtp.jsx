import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../api/authApi";

function VerifyOtp() {
  const navigate = useNavigate();

  const email = localStorage.getItem("pendingEmail");

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await verifyOtp({
        email,
        otp,
      });

      localStorage.removeItem("pendingEmail");

      setMessage("Email verified successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    try {
      await resendOtp({ email });

      setMessage("A new OTP has been sent to your email.");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to resend OTP."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Verify Email
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

        {message && (
          <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full border rounded-lg px-4 py-3 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter OTP"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <button
          onClick={handleResend}
          className="w-full mt-4 border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50"
        >
          Resend OTP
        </button>

      </div>

    </div>
  );
}

export default VerifyOtp;