/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatients } from "../services/patientService";

const Home = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/"); 
      return;
    }
    fetchPatients();
  }, [navigate]);

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access_token"); // إزالة الـ token المنتهي الصلاحية
        navigate("/");
      } else {
        console.error("Error fetching patients:", error.message);
      }
    }
  };

  const navigateToDetails = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center pb-4">
        <h3 className="text-xl font-bold">Patients</h3>
        <button
          onClick={() => navigate("/add")}
          className="px-4 py-2 text-white w-1/7 h-9.5 px-6 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
        >
          Ajouter un Patient
        </button>
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white border-l-4 border-blue-500 rounded-r-lg shadow-sm w-1/5 p-4 cursor-pointer"
            onClick={() => navigateToDetails(patient.id)}
          >
            <h3 className="text-lg font-semibold hover:uppercase ">
              {patient.nom} {patient.prenom}
            </h3>
            <p className="text-gray-400">NNI : {patient.numero_identite}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;