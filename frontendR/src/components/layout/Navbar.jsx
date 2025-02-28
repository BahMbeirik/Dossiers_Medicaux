/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
/* src/components/layout/Navbar.jsx */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaHome, FaUserPlus,FaUsers,FaHospitalSymbol, FaMoon, FaSun } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn,userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      
        {isLoggedIn && (
          <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center space-x-4">
            {/* Admin-specific links */}
            {userRole === "Admin" && (
              <>
                <Link to="/dashboard" className="flex items-center text-lg font-bold text-gray-800 dark:text-white">
                  <FaUsers className="mr-2" />
                  Dashboard Admin
                </Link>
                <Link to="/hospitals" className="flex items-center text-lg font-bold text-gray-800 dark:text-white">
                  <FaHospitalSymbol className="mr-2" />
                  Hôpitaux
                </Link>
                <Link to="/categories" className="flex items-center text-lg font-bold text-gray-800 dark:text-white">
                  <BiSolidCategoryAlt className="mr-2" />
                  Catégories
                </Link>
                <Link to="/add-doctor" className="flex items-center text-lg font-bold text-gray-800 dark:text-white">
                  <FaUserPlus className="mr-2" />
                  Ajouter Docteur
                </Link>
              </>
            )}

            {/* Doctor-specific links */}
            {userRole === "Doctor" && (
              <Link to="/home" className="flex items-center text-lg font-bold text-gray-800 dark:text-white">
                <FaHome className="mr-2" />
                Tableau de Bord des Docteurs
              </Link>
            )}
          </div>
          <div>
            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <FaSignOutAlt className="mr-1" />
              Déconnecter
            </button>
            </div>
          
          </div>
        )}
      
    </nav>
  );
};

export default Navbar;
