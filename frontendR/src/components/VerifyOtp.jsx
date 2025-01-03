/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyOtp = ({ onLogin }) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post("http://localhost:8000/api/auth/verify-otp/", {
        email,
        otp,
      });

      localStorage.setItem("access_token", response.data.access);
      onLogin(); // تحديث حالة تسجيل الدخول
      navigate("/home");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Verify OTP</h2>
        <p>A verification code has been sent to {email}</p>

        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring border-gray-300"
          />
        </div>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        <button
          type="submit"
          disabled={isLoading || !otp}
          className={`w-full p-3 rounded-md text-white ${
            isLoading || !otp ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;