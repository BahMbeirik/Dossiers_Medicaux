/* src/components/patient/PatientDetails.jsx */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPatientDetails, deletePatient } from "../../services/patientService";
import { FaEdit, FaFileMedical, FaTrash, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const PatientDetails = () => {
  const [patient, setPatient] = useState(null);
  const { id } = useParams(); // Patient ID from route
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatientDetails(id);
        setPatient(data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des détails du patient.");
        console.error(error);
      }
    };

    fetchPatient();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await deletePatient(id);
      toast.success('Patient supprimé avec succès.');
      navigate('/home');
    } catch (error) {
      toast.error("Erreur lors de la suppression du patient.");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  if (!patient) {
    return <div className="text-center mt-10">Chargement des détails du patient...</div>;
  }

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-2xl">
      <h1 className="text-center text-blue-900 dark:text-blue-300 text-4xl mb-6 flex items-center justify-center">
        <FaUserCircle className="mr-2" />
        Détails du Patient
      </h1>
      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300"><strong>Nom:</strong> {patient.nom}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Prénom:</strong> {patient.prenom}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Date de naissance:</strong> {new Date(patient.date_naissance).toLocaleDateString('fr-FR')}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Sexe:</strong> {patient.sex === 'M' ? 'Masculin' : 'Féminin'}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Numéro d'identité:</strong> {patient.numero_identite}</p>
        <p className="text-gray-700 dark:text-gray-300"><strong>Numéro de téléphone:</strong> {patient.numero_telephone}</p>
      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleEdit}
        >
          <FaEdit className="mr-2" />
          Modifier
        </button>
        <Link
          to={`/patients/${id}/documents/new`}
          className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <FaFileMedical className="mr-2" />
          Document
        </Link>
        <button
          className={`flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ${
            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <FaTrash className="mr-2" />
          {isDeleting ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>
    </div>
  );
};

export default PatientDetails;