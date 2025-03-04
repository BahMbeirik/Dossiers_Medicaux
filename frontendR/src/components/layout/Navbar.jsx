/* src/components/layout/Navbar.jsx */
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaSignOutAlt, 
  FaHome, 
  FaUserPlus, 
  FaUsers, 
  FaHospitalSymbol, 
  FaMoon, 
  FaSun,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/login");
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path ? 
      "bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400" : 
      "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
  };

  if (!isLoggedIn) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">MediPlus</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {/* Admin-specific links */}
              {userRole === "Admin" && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/dashboard")} transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <FaUsers className="mr-2" />
                      Dashboard
                    </div>
                  </Link>
                  <Link 
                    to="/hospitals" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/hospitals")} transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <FaHospitalSymbol className="mr-2" />
                      Hôpitaux
                    </div>
                  </Link>
                  <Link 
                    to="/categories" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/categories")} transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <BiSolidCategoryAlt className="mr-2" />
                      Catégories
                    </div>
                  </Link>
                  <Link 
                    to="/add-doctor" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/add-doctor")} transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <FaUserPlus className="mr-2" />
                      Ajouter Docteur
                    </div>
                  </Link>
                </>
              )}

              {/* Doctor-specific links */}
              {userRole === "Doctor" && (
                <Link 
                  to="/home" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/home")} transition-colors duration-200`}
                >
                  <div className="flex items-center">
                    <FaHome className="mr-2" />
                    Tableau de Bord
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-3">

            {/* User role badge */}
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {userRole}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-2" />
              Déconnecter
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} transition-all duration-200 ease-in-out`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
          {/* Admin-specific links for mobile */}
          {userRole === "Admin" && (
            <>
              <Link 
                to="/dashboard" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/dashboard")} transition-colors duration-200`}
              >
                <div className="flex items-center">
                  <FaUsers className="mr-3" />
                  Dashboard
                </div>
              </Link>
              <Link 
                to="/hospitals" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/hospitals")} transition-colors duration-200`}
              >
                <div className="flex items-center">
                  <FaHospitalSymbol className="mr-3" />
                  Hôpitaux
                </div>
              </Link>
              <Link 
                to="/categories" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/categories")} transition-colors duration-200`}
              >
                <div className="flex items-center">
                  <BiSolidCategoryAlt className="mr-3" />
                  Catégories
                </div>
              </Link>
              <Link 
                to="/add-doctor" 
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/add-doctor")} transition-colors duration-200`}
              >
                <div className="flex items-center">
                  <FaUserPlus className="mr-3" />
                  Ajouter Docteur
                </div>
              </Link>
            </>
          )}

          {/* Doctor-specific links for mobile */}
          {userRole === "Doctor" && (
            <Link 
              to="/home" 
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/home")} transition-colors duration-200`}
            >
              <div className="flex items-center">
                <FaHome className="mr-3" />
                Tableau de Bord
              </div>
            </Link>
          )}

          {/* User role badge for mobile */}
          <div className="px-3 py-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {userRole}
            </span>
          </div>

          {/* Logout button for mobile */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <FaSignOutAlt className="mr-3" />
            Déconnecter
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;