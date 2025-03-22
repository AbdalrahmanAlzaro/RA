import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, Eye, EyeOff, Lock, Shield, Check } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Password strength requirements
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
    newPassword
  );
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  // Countdown timer for redirection
  useEffect(() => {
    if (redirecting && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (redirecting && countdown === 0) {
      navigate("/login");
    }
  }, [redirecting, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/reset-password",
        {
          token,
          newPassword,
        }
      );
      setMessage(response.data.message);
      setRedirecting(true); // Start countdown
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={
                    star <= 4
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Create New Password
          </h2>
          <p className="mt-2 text-gray-600">
            Set a strong password for your account
          </p>
        </div>

        {message && (
          <div
            className="p-4 text-sm text-green-700 bg-green-100 rounded-lg flex items-start"
            role="alert"
          >
            <Check size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{message}</p>
              {redirecting && (
                <p className="mt-1">
                  Redirecting to login in {countdown} seconds...
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div
            className="p-4 text-sm text-red-700 bg-red-100 rounded-lg"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield size={20} className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Password strength indicator */}
            {newPassword.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Password must contain:
                </p>
                <ul className="text-sm space-y-1">
                  <li
                    className={`flex items-center ${
                      hasMinLength ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 mr-2 rounded-full ${
                        hasMinLength ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {hasMinLength && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </span>
                    At least 8 characters
                  </li>
                  <li
                    className={`flex items-center ${
                      hasUppercase ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 mr-2 rounded-full ${
                        hasUppercase ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {hasUppercase && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </span>
                    At least one uppercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      hasLowercase ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 mr-2 rounded-full ${
                        hasLowercase ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {hasLowercase && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </span>
                    At least one lowercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      hasNumber ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 mr-2 rounded-full ${
                        hasNumber ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {hasNumber && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </span>
                    At least one number
                  </li>
                  <li
                    className={`flex items-center ${
                      hasSpecialChar ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 mr-2 rounded-full ${
                        hasSpecialChar ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {hasSpecialChar && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </span>
                    At least one special character
                  </li>
                  {confirmPassword.length > 0 && (
                    <li
                      className={`flex items-center ${
                        passwordsMatch ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 mr-2 rounded-full ${
                          passwordsMatch ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {passwordsMatch && (
                          <Check size={16} className="text-green-600" />
                        )}
                      </span>
                      Passwords match
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || redirecting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
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
                  Processing...
                </span>
              ) : redirecting ? (
                "Password Reset Successful!"
              ) : (
                "Reset Password"
              )}
            </button>
          </div>

          {!redirecting && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
