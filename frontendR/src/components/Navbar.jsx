/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // استدعاء دالة تسجيل الخروج
    navigate("/"); // إعادة التوجيه إلى صفحة تسجيل الدخول
  };

  return (
    <nav className="bg-white shadow-sm">
  <div className="container mx-auto flex items-center justify-between py-4 px-6">
    <Link to="/home" className="text-lg font-bold text-gray-800">
      Dossiers Patients
    </Link>
    {isLoggedIn && (
      <form>
        <button
          type="button"
          className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={handleLogout}
        >
          Déconnecter
        </button>
      </form>
    )}
  </div>
</nav>

  );
};

export default Navbar;
