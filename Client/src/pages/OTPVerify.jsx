import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const OTPVerify = () => {
  const { state } = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [countdownActive, setCountdownActive] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const email = state?.email;

  useEffect(() => {
    // Focus on first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Email not found. Please sign up again.",
      }).then(() => {
        navigate("/signup");
      });
    }
  }, [email, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCountdownActive(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, countdownActive]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    // Update the OTP array
    const newOtp = [...otp];

    // Only take the last character if someone pastes multiple digits
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input if a value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Only process if it looks like an OTP
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);

    // Focus on the next empty field or the last field
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    if (inputRefs.current[lastFilledIndex + 1]) {
      inputRefs.current[lastFilledIndex + 1].focus();
    } else {
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const otpString = otp.join("");

    // Validate OTP length
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits of the OTP");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/verify-otp",
        {
          email,
          otp: otpString,
        }
      );

      if (response.status === 200) {
        const { token, user } = response.data;
        login(token, user);

        Swal.fire({
          icon: "success",
          title: "OTP Verified!",
          text: "Your OTP has been verified successfully.",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      } else {
        setError(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/resend-otp",
        {
          email,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "OTP Resent!",
          text: "A new OTP has been sent to your email.",
        });
        // Reset countdown
        setCountdown(60);
        setCountdownActive(true);
      } else {
        setError(response.data.message || "Error resending OTP");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg mt-10 mb-10 border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Verify Your Account
          </h2>
          <p className="mt-3 text-gray-600">
            We've sent a 6-digit OTP to
            <span className="font-medium text-indigo-600 ml-1">{email}</span>
          </p>
        </div>

        {error && (
          <div
            className="p-4 text-sm text-red-700 bg-red-100 rounded-lg"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Enter verification code
            </label>
            <div className="flex justify-center gap-2 sm:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm bg-gray-50"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors font-medium text-lg shadow-md"
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
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Verify Account
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendOtp}
            disabled={resendLoading || countdownActive}
            className={`text-indigo-600 hover:text-indigo-800 font-medium ${
              countdownActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {resendLoading
              ? "Resending..."
              : countdownActive
              ? `Resend OTP in ${countdown}s`
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
