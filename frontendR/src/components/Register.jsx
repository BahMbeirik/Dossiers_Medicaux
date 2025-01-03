/* eslint-disable no-unused-vars */
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post("http://localhost:8000/api/auth/register/", {
          email: values.email,
          password: values.password,
        });

        // الانتقال إلى صفحة تسجيل الدخول
        navigate("/");
      } catch (error) {
        alert(error.response?.data?.error || "Registration failed");
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
  <form
    onSubmit={formik.handleSubmit}
    className="p-8 rounded-lg shadow-md bg-white w-full max-w-md"
  >
    <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

    <div className="mb-4">
      <label htmlFor="email" className="block mb-2 text-sm font-medium">
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
        className={`w-full p-3 border rounded-lg ${
          formik.touched.email && formik.errors.email
            ? "border-red-500"
            : "border-gray-300"
        }`}
      />
      {formik.touched.email && formik.errors.email && (
        <div className="text-red-500 text-xs mt-1">
          {formik.errors.email}
        </div>
      )}
    </div>

    <div className="mb-4">
      <label htmlFor="password" className="block mb-2 text-sm font-medium">
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
        className={`w-full p-3 border rounded-lg ${
          formik.touched.password && formik.errors.password
            ? "border-red-500"
            : "border-gray-300"
        }`}
      />
      {formik.touched.password && formik.errors.password && (
        <div className="text-red-500 text-xs mt-1">
          {formik.errors.password}
        </div>
      )}
    </div>

    <div className="mb-4">
      <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
        Confirm Password
      </label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        placeholder="Confirm your password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.confirmPassword}
        className={`w-full p-3 border rounded-lg ${
          formik.touched.confirmPassword && formik.errors.confirmPassword
            ? "border-red-500"
            : "border-gray-300"
        }`}
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <div className="text-red-500 text-xs mt-1">
          {formik.errors.confirmPassword}
        </div>
      )}
    </div>

    <button
      type="submit"
      disabled={!formik.isValid}
      className={`w-full p-3 rounded-lg text-white ${
        !formik.isValid
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-gray-800 hover:bg-gray-900"
      }`}
    >
      Register
    </button>
  </form>
</div>

  );
};

export default Register;
