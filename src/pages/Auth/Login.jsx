import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login, isAuthenticated } from "../../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        // Redirect to the page they tried to visit or home
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg p-6">
        <div className="flex justify-center items-center flex-col">
          <h2 className="text-3xl lg:text-2xl text-center font-bold mb-2">
            Admin Login
          </h2>
          <p className="text-center text-sm text-grey mb-6">
            Login to access the admin dashboard. Only authorized admin users
            can access this system.
          </p>
        </div>

        <div className="border border-gray-300 p-4 rounded-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-md font-bold text-black-100"
              >
                Email Address
              </label>
              <div className="flex items-center border rounded-xl bg-transparent border-gray-300">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent text-primary placeholder-gray-500 focus:outline-primary focus:rounded-xl text-sm px-3 py-2"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-md font-bold text-black-100"
              >
                Password
              </label>
              <div className="flex items-center border rounded-xl bg-transparent border-gray-300">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent text-primary placeholder-gray-500 focus:outline-primary focus:rounded-xl text-sm px-3 py-2"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 text-md font-medium border border-transparent rounded-xl text-white bg-primary hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

