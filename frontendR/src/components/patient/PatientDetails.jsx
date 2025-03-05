/* src/components/patient/PatientDetails.jsx */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getPatientDetails, deletePatient } from "../../services/patientService";
import { FaEdit, FaFileMedical, FaTrash, FaUserCircle, FaPhone, FaIdCard, FaBirthdayCake, FaVenusMars } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const PatientDetails = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Patient ID from route
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const data = await getPatientDetails(id);
        setPatient(data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des détails du patient.");
        console.error(error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
        <span className="ml-3 text-gray-700 dark:text-gray-300">Chargement des détails...</span>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-2xl text-center">
        <h2 className="text-xl text-gray-800 dark:text-gray-200">Patient non trouvé</h2>
        <button 
          onClick={() => navigate('/home')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto m-5 p-0 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-2xl overflow-hidden">
      {/* Header with subtle blue accent */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 border-b-2 border-blue-400">
        <div className="flex items-center justify-center mb-4">
          <FaUserCircle className="text-blue-500 dark:text-blue-400 text-5xl" />
        </div>
        <h1 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-200">
          {patient.nom} {patient.prenom} 
        </h1>
      </div>
      
      {/* Patient details with subtle colored icons */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <div className="flex items-center">
              <FaBirthdayCake className="text-blue-400 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date de naissance</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{new Date(patient.date_naissance).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <div className="flex items-center">
              <FaVenusMars className="text-blue-400 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sexe</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{patient.sex === 'M' ? 'Masculin' : 'Féminin'}</p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <div className="flex items-center">
              <FaIdCard className="text-blue-400 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Numéro d'identité</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{patient.numero_identite}</p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <div className="flex items-center">
              <FaPhone className="text-blue-400 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Numéro de téléphone</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{patient.numero_telephone}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons with minimal color */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              onClick={handleEdit}
            >
              <FaEdit className="mr-2" />
              Modifier
            </button>
            <Link
              to={`/patients/${id}/documents/new`}
              className="flex items-center justify-center px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
            >
              <FaFileMedical className="mr-2" />
              Ajouter Document
            </Link>
            <button
              className={`flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 ${
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
      </div>
    </div>
  );
};

export default PatientDetails;