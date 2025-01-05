/* src/components/layout/Navbar.jsx */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaHome, FaUserPlus, FaMoon, FaSun } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/home" className="flex items-center text-lg font-bold text-gray-800 dark:text-white">
          <FaHome className="mr-2" />
          Dossiers Patients
        </Link>
        {isLoggedIn && (
          <div className="flex items-center space-x-4">

            {/* <Link to="/add" className="flex items-center text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
              <FaUserPlus className="mr-1" />
              Ajouter
            </Link> */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <FaSignOutAlt className="mr-1" />
              Déconnecter
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
