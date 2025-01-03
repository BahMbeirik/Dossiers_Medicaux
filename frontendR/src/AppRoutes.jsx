/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import VerifyOtp from "./components/VerifyOtp";
import Navbar from "./components/Navbar";
import PatientDetails from './components/patientDetails';
import AddPatient from "./components/addPatient";
import EditPatient from "./components/editPatient";

const AppRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/verify-otp" element={<VerifyOtp onLogin={handleLogin} />} />
          <Route path="/details/:id" element={<PatientDetails />} />
          <Route path="/add" element={<AddPatient />} />
          <Route path="/edit/:id" element={<EditPatient />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;