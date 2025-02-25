/* eslint-disable no-unused-vars */
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Grid, Typography, Paper } from "@mui/material";
import HospitalStats from "./HospitalStats";
import CategoryStats from "./CategoryStats";
const AdminDashboard = () => {
  const { userRole } = useAuth();

  if (userRole !== 'Admin') {
    return <div>Accès refusé. Seuls les administrateurs peuvent accéder à cette page.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper style={{ padding: "20px" }}>
            <Typography  variant="h6">Le nombre de médecins dans chaque hôpital</Typography>
          <br />
            <HospitalStats />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper style={{ padding: "20px" }}>
            <Typography variant="h6">Les catégories les plus couramment utilisées</Typography>
            <CategoryStats />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;