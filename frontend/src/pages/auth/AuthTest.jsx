import { Link } from "react-router-dom";

function AuthTest() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">

      <h1 className="text-3xl font-bold">
        Authentication Pages
      </h1>

      <Link
        to="/login"
        className="text-blue-600"
      >
        Login
      </Link>

      <Link
        to="/register"
        className="text-blue-600"
      >
        Register
      </Link>

      <Link
        to="/forgot-password"
        className="text-blue-600"
      >
        Forgot Password
      </Link>

    </div>
  );
}

export default AuthTest;