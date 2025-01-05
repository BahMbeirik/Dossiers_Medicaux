/* src/components/auth/Register.jsx */
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/AuthService";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus } from 'react-icons/fa';
import { toast } from "react-hot-toast";

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
        .email("Format d'email invalide")
        .required("Email est requis"),
      password: Yup.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Mot de passe est requis"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Les mots de passe doivent correspondre")
        .required("La confirmation du mot de passe est requise"),
    }),
    onSubmit: async (values) => {
      try {
        await AuthService.register({
          email: values.email,
          password: values.password,
          confirm_password: values.confirmPassword,
        });
        toast.success("Inscription réussie ! Veuillez vous connecter.");
        navigate("/login");
      } catch (error) {
        toast.error(error.response?.data?.error || "Échec de l'inscription.");
        console.error(error);
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
          <FaUserPlus className="mr-2" />
          Inscription
        </h2>

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
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
              formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.email}
            </div>
          )}
        </div>

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
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
              formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-xs mt-1">
              {formik.errors.password}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirmez votre mot de passe"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring ${
              formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-gray-300"
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
          disabled={!(formik.isValid && formik.dirty)}
          className={`w-full p-3 rounded-lg text-white ${
            !(formik.isValid && formik.dirty)
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } flex items-center justify-center`}
        >
          {!(formik.isValid && formik.dirty) ? 'Inscription' : (
            <>
              <FaUserPlus className="mr-2" />
              Inscription
            </>
          )}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
