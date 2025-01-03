/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";

const Login = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/login/",
          values
        );

        navigate("/verify-otp", { state: { email: values.email } });
      } catch (error) {
        setErrorMessage(
          error.response?.data?.error || "Login failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            disabled={isLoading}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring ${
              formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-xs mt-1">
              <small>{formik.errors.email}</small>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            disabled={isLoading}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring ${
              formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-xs mt-1">
              <small>{formik.errors.password}</small>
            </div>
          )}
        </div>

        {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

        <button
          type="submit"
          disabled={isLoading || !formik.isValid}
          className={`w-full p-3 rounded-md text-white ${
            isLoading || !formik.isValid ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;