/* eslint-disable no-unused-vars */
/* src/AppRoutes.jsx */
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VerifyOtp from "./components/auth/VerifyOtp";
import Home from "./components/patient/Home";
import AddPatient from "./components/patient/AddPatient";
import EditPatient from "./components/patient/EditPatient";
import PatientDetails from "./components/patient/PatientDetails";
import CreateDocument from "./components/document/CreateDocument";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import DocumentDetail from "./components/document/DocumentDetails";
import AdminDashboard from "./components/admin/AdminDashboard";
import CreateDoctor from "./components/admin/CreateDoctor";
import Hospital from "./components/admin/Hospital";
import Category from "./components/admin/Category";
import Field from "./components/admin/Field";
import HospitalDoctors from "./components/admin/HospitalDoctors";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            
            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddPatient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditPatient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/details/:id"
              element={
                <ProtectedRoute>
                  <PatientDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/:documentId"
              element={
                <ProtectedRoute>
                  <DocumentDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients/:id/documents/new"
              element={
                <ProtectedRoute>
                  <CreateDocument />
                </ProtectedRoute>
              }
            />
            {/* Admin-specific routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/hospitals" 
              element={
                <ProtectedRoute>
                  <Hospital />
                </ProtectedRoute>
              } 
            />
            <Route path="/categories" element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
              } 
            />
            <Route path="/category/:categories_pk/fields" 
              element={
                <ProtectedRoute>
                  <Field />
                </ProtectedRoute>
                } 
              />
              <Route path="/hospitals/:hospitalId/doctors" 
                element={
                  <ProtectedRoute>
                    <HospitalDoctors />
                  </ProtectedRoute>
                } />
            <Route
              path="/add-doctor"
              element={
                <ProtectedRoute>
                  <CreateDoctor />
                </ProtectedRoute>
              }
            />
            {/* Redirect any unknown routes to home */}
            {/*<Route path="*" element={<Navigate to="/home" />} />*/}
          </Routes>
          <Toaster position="top-right" reverseOrder={false} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
