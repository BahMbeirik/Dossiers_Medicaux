import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/AuthService";
import { toast } from "react-hot-toast";
import { FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emailFromUrl = searchParams.get("email") || "";

  const [otp, setOtp] = useState(""); // Store OTP input
  const [isVerified, setIsVerified] = useState(false); // Track OTP verification status
  const [loading, setLoading] = useState(false); // Track form submission
  const [checkingOTP, setCheckingOTP] = useState(false); // Track OTP checking

  // 🔹 Redirect unauthorized users if email is missing
  useEffect(() => {
    if (!emailFromUrl) {
      toast.error("Accès interdit. Vous devez être invité par un administrateur.");
      navigate("/login");
    }
  }, [emailFromUrl, navigate]);

  // 🔹 Prefill the email field
  useEffect(() => {
    if (emailFromUrl) {
      formik.setFieldValue("email", emailFromUrl);
    }
  }, [emailFromUrl]);

  // 🔹 OTP Verification
  const verifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Veuillez entrer votre OTP.");
      return;
    }

    setCheckingOTP(true);
    try {
      await AuthService.verifyOTP({ email: emailFromUrl, otp });
      toast.success("OTP vérifié avec succès !");
      setIsVerified(true);
    } catch (error) {
      toast.error("OTP invalide ou expiré.");
      setIsVerified(false);
    } finally {
      setCheckingOTP(false);
    }
  };

  // 🔹 Formik for registration
  const formik = useFormik({
    initialValues: {
      email: emailFromUrl,
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Format d'email invalide")
        .required("Email est requis"),
      username: Yup.string()
        .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
        .required("Nom d'utilisateur est requis"),
      password: Yup.string()
        .min(12, "Le mot de passe doit contenir au moins 12 caractères")
        .matches(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
        .matches(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
        .matches(/\d/, "Le mot de passe doit contenir au moins un chiffre")
        .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{12,}$/, "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)")
        .required("Mot de passe est requis"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Les mots de passe doivent correspondre")
        .required("La confirmation du mot de passe est requise"),
    }),
    
    
    // onSubmit: async (values) => {
    //   if (!isVerified) {
    //     toast.error("Veuillez vérifier votre OTP avant de vous inscrire.");
    //     return;
    //   }

    //   setLoading(true);
    //   try {
    //     await AuthService.register({
    //       email: values.email,
    //       username: values.username,
    //       password: values.password,
    //       confirm_password: values.confirmPassword,
    //     });

    //     toast.success("Inscription réussie ! Veuillez vous connecter.");
    //     navigate("/login");
    //   } catch (error) {
    //     toast.error(error.response?.data?.error || "Échec de l'inscription.");
    //   } finally {
    //     setLoading(false);
    //   }
    // },

    // onSubmit: async (values) => {
    //   if (!isVerified) {
    //     toast.error("Veuillez vérifier votre OTP avant de vous inscrire.");
    //     return;
    //   }
        
    //   setLoading(true);
    //   try {
    //     await AuthService.register({
    //       email: values.email,
    //       username: values.username,
    //       password: values.password,
    //       confirm_password: values.confirmPassword,
    //     });
    
    //     toast.success("Inscription réussie ! Veuillez vous connecter.");
    //     navigate("/login");
    //   } catch (error) {
    //     console.error("❌ Registration failed:", error.response?.data);
    //     toast.error(error.response?.data?.error || "Échec de l'inscription.");
    //   } finally {
    //     setLoading(false);
    //   }
    // },

    onSubmit: async (values) => {
      if (!isVerified) {
        toast.error("Veuillez vérifier votre OTP avant de vous inscrire.");
        return;
      }
    
      setLoading(true);
      try {
        await AuthService.register({
          email: values.email,
          username: values.username,
          password: values.password,
          confirm_password: values.confirmPassword,
        });
    
        toast.success("Inscription réussie ! Redirection vers la page de connexion...");
        
        // 🔹 Explicitly redirect to the login page
        navigate("/login");
      } catch (error) {
        console.error("❌ Registration failed:", error.response?.data);
        toast.error(error.response?.data?.error || "Échec de l'inscription.");
      } finally {
        setLoading(false);
      }
    }
    
    
    
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center">
          <FaUserPlus className="mr-2" />
          Inscription
        </h2>

        {/* Email Field (Auto-Filled & Disabled) */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            disabled
            className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* OTP Verification */}
        {!isVerified && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Vérification OTP</label>
            <input
              type="text"
              placeholder="Entrez votre OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <button
              type="button"
              onClick={verifyOtp}
              className={`mt-2 p-2 w-full text-white rounded-lg ${checkingOTP ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
              disabled={checkingOTP}
            >
              {checkingOTP ? "Vérification..." : "Vérifier OTP"}
            </button>
          </div>
        )}

        {/* Hidden Until OTP is Verified */}
        {isVerified && (
          <>
            {/* Username Field */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Entrez votre nom d'utilisateur"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                className="w-full p-3 border rounded-lg"
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
              )}
            </div>

            {/* Password Fields */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Entrez votre mot de passe"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full p-3 border rounded-lg"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmez votre mot de passe"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className="w-full p-3 border rounded-lg"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !(formik.isValid && formik.dirty)}
              className={`w-full p-3 rounded-lg text-white ${loading || !(formik.isValid && formik.dirty) ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
            >
              {loading ? "Inscription..." : "Inscription"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
