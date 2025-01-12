/* eslint-disable no-unused-vars */
import React from "react";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { userRole } = useAuth();

  if (userRole !== 'Admin') {
    return <div>Accès refusé. Seuls les administrateurs peuvent accéder à cette page.</div>;
  }

  return (
    <div>
      <h1>Tableau de bord Administrateur</h1>
    </div>
  );
};

export default AdminDashboard;