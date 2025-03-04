import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Grid, Typography, Paper, CircularProgress, Box, Card, CardContent, CardHeader, Divider, useTheme, alpha } from "@mui/material";
import { LocalHospital as HospitalIcon, Category as CategoryIcon, Description as DocumentIcon, PersonAdd as DoctorIcon } from "@mui/icons-material";
import HospitalStats from "./HospitalStats";
import CategoryStats from "./CategoryStats";
import { getAdminDashboardData } from "../../services/AdminDashboard"; // Import the service

const AdminDashboard = () => {
  const { userRole } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message || "Une erreur s'est produite lors de la récupération des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (userRole !== "Admin") {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" color="error">Accès Refusé</Typography>
        <Typography>Seuls les administrateurs peuvent accéder à cette page.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error">Erreur</Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: alpha(color, 0.1),
              borderRadius: 1,
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { sx: { color } })}
          </Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Tableau de Bord Administrateur
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Catégories" value={dashboardData.total_categories} icon={<CategoryIcon />} color={theme.palette.primary.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Hôpitaux" value={dashboardData.total_hospitals} icon={<HospitalIcon />} color={theme.palette.success.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Documents" value={dashboardData.total_documents} icon={<DocumentIcon />} color={theme.palette.warning.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Médecins" value={dashboardData.total_doctors} icon={<DoctorIcon />} color={theme.palette.info.main} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardHeader title="Distribution des Médecins par Hôpital" titleTypographyProps={{ variant: 'h6' }} sx={{ pb: 0 }} />
            <Divider sx={{ mt: 2 }} />
            <CardContent>
              <HospitalStats data={dashboardData.hospital_stats} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader title="Catégories les Plus Utilisées" titleTypographyProps={{ variant: 'h6' }} sx={{ pb: 0 }} />
            <Divider sx={{ mt: 2 }} />
            <CardContent>
              <CategoryStats data={dashboardData.category_stats} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
