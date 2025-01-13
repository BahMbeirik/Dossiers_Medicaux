/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* src/components/auth/Login.jsx */
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/AuthService";
import { useAuth } from "../../context/AuthContext";
import { FaSignInAlt } from 'react-icons/fa';
import { toast } from "react-hot-toast";

const Login = () => {
  const { isLoggedIn, login, userRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isLoggedIn) {
      if (userRole === "Admin") {
        navigate("/dashboard");
      } else if (userRole === "Doctor") {
        navigate("/home");
      } else {
        navigate("/");
      }
    }
  }, [isLoggedIn, navigate, userRole]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Format d'email invalide")
        .required("Email est requis"),
      password: Yup.string().required("Mot de passe est requis"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await AuthService.login(values);
        console.log("Login Response:", response.data); // Debugging
        // login(response.data); // Store tokens and update context
        navigate("/verify-otp", { state: { email: values.email } }); // Navigate to OTP
        toast.success("Connexion réussie ! Veuillez vérifier votre OTP.");
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Échec de la connexion. Veuillez réessayer."
        );
        console.error("Login Error:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center">
          <FaSignInAlt className="mr-2" />
          Connexion
        </h2>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Entrez votre email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            disabled={isLoading}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
              formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-xs mt-1">
              <small>{formik.errors.email}</small>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Entrez votre mot de passe"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            disabled={isLoading}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
              formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-xs mt-1">
              <small>{formik.errors.password}</small>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formik.isValid}
          className={`w-full p-3 rounded-lg text-white ${
            isLoading || !formik.isValid
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } flex items-center justify-center`}
        >
          {isLoading ? "Connexion en cours..." : (
            <>
              <FaSignInAlt className="mr-2" />
              Connexion
            </>
          )}
        </button>

        {/* Register Link */}
        <div className="text-center mt-4">
          <p className="text-sm">
            Vous n'avez pas de compte ?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Inscrivez-vous ici
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
