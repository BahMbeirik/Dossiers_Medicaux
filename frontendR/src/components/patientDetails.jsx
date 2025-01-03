/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PatientDetails = () => {
  const [patient, setPatient] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();  // استخدم useParams للحصول على id من المسار

  useEffect(() => {
    // Fetch patient data by ID when the component mounts
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/auth/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setPatient(response.data);
      } catch (error) {
        setErrorMessage('Error fetching patient details');
        console.error(error);
      }
    };
    

    fetchPatientDetails();
  }, [id]);

  const deletePatient = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/auth/patients/${patient.id}`);
      navigate('/home');
    } catch (error) {
      setErrorMessage('Error deleting patient');
      console.error(error);
    }
  };

  const editPatient = () => {
    navigate(`/edit/${patient.id}`);
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto m-5 p-6  rounded-lg shadow-lg bg-white">
  <h1 className="text-center text-blue-900 text-4xl mb-6">Patient Details</h1>
  {errorMessage && (
    <div className="bg-red-500 text-white p-3 rounded mb-4">
      {errorMessage}
    </div>
  )}
  <div className="mb-4">
    <p><strong>Name:</strong> {patient.nom}</p>
    <p><strong>First Name:</strong> {patient.prenom}</p>
    <p><strong>Age:</strong> {patient.age}</p>
    <p><strong>ID Number:</strong> {patient.numero_identite}</p>
    <p><strong>Phone Number:</strong> {patient.numero_telephone}</p>
  </div>
  <div className="flex justify-between gap-4">
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/6"
      onClick={editPatient}
    >
      Edit
    </button>
    <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 w-1/2">
      Document
    </button>
    <button
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 w-1/6"
      onClick={deletePatient}
    >
      Delete
    </button>
  </div>
</div>

  );
};

export default PatientDetails;
