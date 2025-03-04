import React, { useState, useEffect } from 'react';
import { 
  getHospitals, 
  getDoctors, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} from '../../services/AdminService';
import { toast } from 'react-hot-toast';
import { 
  FaUserPlus, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ email: '', hospital: '' });
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // States for update (edit) functionality
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  // For update only the hospital, keep email unchanged
  const [editedHospital, setEditedHospital] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals();
    fetchDoctors();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await getHospitals();
      setHospitals(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des hôpitaux.');
    }
  };

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await getDoctors();
      setDoctors(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des docteurs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDoctor = async () => {
    if (!newDoctor.email || !newDoctor.hospital) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    try {
      await createDoctor(newDoctor);
      toast.success('Docteur ajouté avec succès.');
      setNewDoctor({ email: '', hospital: '' });
      fetchDoctors();
      setActiveTab('list');
    } catch (error) {
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctorId(doctor.id);
    // Set the current hospital for editing
    setEditedHospital(doctor.hospital);
  };

  const handleUpdateDoctor = async (doctorId) => {
    if (!editedHospital) {
      toast.error("Veuillez sélectionner un hôpital.");
      return;
    }
    try {
      // Only update the hospital field
      await updateDoctor(doctorId, { hospital: editedHospital });
      toast.success('Docteur mis à jour avec succès.');
      setEditingDoctorId(null);
      setEditedHospital('');
      fetchDoctors();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du docteur.");
    }
  };

  const handleCancelEdit = () => {
    setEditingDoctorId(null);
    setEditedHospital('');
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce docteur ?')) {
      try {
        await deleteDoctor(doctorId);
        toast.success('Docteur supprimé avec succès.');
        fetchDoctors();
      } catch (error) {
        toast.error("Erreur lors de la suppression du docteur.");
      }
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
            <FaUserPlus className="text-blue-600 dark:text-blue-300 size-6" />
          </div>
          <h1 className="text-blue-900 dark:text-blue-300 text-2xl font-bold">Gestion des Docteurs</h1>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-6 -mb-px text-sm font-medium transition-all duration-200 ease-in-out ${
            activeTab === 'list'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-b-2 border-transparent text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Liste des Docteurs
        </button>
        <button
          className={`py-2 px-6 -mb-px text-sm font-medium transition-all duration-200 ease-in-out ${
            activeTab === 'create'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-b-2 border-transparent text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300'
          }`}
          onClick={() => setActiveTab('create')}
        >
          Ajouter un Docteur
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="p-4">
          {/* Search bar */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Rechercher un docteur par email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm
                  ? 'Aucun docteur ne correspond à votre recherche.'
                  : 'Aucun docteur trouvé.'}
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                <FaPlus className="mr-2" /> Ajouter un docteur
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-all duration-200"
                >
                  <div className="p-4 flex justify-between items-center">
                    {editingDoctorId === doctor.id ? (
                      // Edit Mode: update only the hospital
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 dark:text-white">
                          {doctor.email}
                        </div>
                        <select
                          value={editedHospital}
                          onChange={(e) => setEditedHospital(e.target.value)}
                          className="w-full mt-2 p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
                        >
                          <option value="">Sélectionnez un hôpital</option>
                          {hospitals.map((hospital) => (
                            <option key={hospital.id} value={hospital.id}>
                              {hospital.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      // Display Mode
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 dark:text-white">
                          {doctor.email}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {hospitals.find((h) => h.id === doctor.hospital)?.name ||
                            'Hôpital inconnu'}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      {editingDoctorId === doctor.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateDoctor(doctor.id)}
                            className="text-green-500 hover:text-green-600"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-500 hover:text-red-600"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditDoctor(doctor)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doctor.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Ajouter un nouveau Docteur
          </h2>
          <div className="mb-6">
            <label
              htmlFor="doctor-email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email du Docteur
            </label>
            <input
              type="email"
              id="doctor-email"
              value={newDoctor.email}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, email: e.target.value })
              }
              placeholder="exemple@docteur.com"
              className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="doctor-hospital"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Hôpital associé
            </label>
            <select
              id="doctor-hospital"
              value={newDoctor.hospital}
              onChange={(e) =>
                setNewDoctor({ ...newDoctor, hospital: e.target.value })
              }
              className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Sélectionnez un hôpital</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleAddDoctor}
              className="flex-1 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-200"
            >
              Ajouter le Docteur
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
