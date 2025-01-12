/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDoctorsByHospital } from '../../services/AdminService';
import { toast } from 'react-hot-toast';

const HospitalDoctors = () => {
  const { hospitalId } = useParams();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, [hospitalId]);

  const fetchDoctors = async () => {
    try {
      const response = await getDoctorsByHospital(hospitalId);
      setDoctors(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des médecins.');
    }
  };

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-4xl">
      <h1 className="text-center text-blue-900 dark:text-blue-300 text-3xl mb-6">Médecins de l'hôpital</h1>
      {doctors.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Aucun médecin trouvé.</p>
      ) : (
        <div>
          {doctors.map((doctor) => (
            <div key={doctor.id} className="mb-2">
            <div className="bg-gray-50 dark:bg-gray-700 border-b-2 border-blue-500 shadow-sm w-full p-1">
            <p className="text-gray-800 dark:text-gray-200">Nom: {doctor.username}</p>
            <p className="text-gray-800 dark:text-gray-200">Email: {doctor.email}</p>
          </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalDoctors;