import React, { useState, useEffect } from 'react';
import { 
  getHospitals, 
  getDoctorsByHospital, 
  createHospital, 
  updateHospital, 
  deleteHospital 
} from '../../services/AdminService';
import { toast } from 'react-hot-toast';
import { 
  FaHospitalSymbol, 
  FaSearch, 
  FaPlus, 
  FaArrowRight, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaArrowLeft 
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Hospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [newHospital, setNewHospital] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // States for update (edit) functionality
  const [editingHospitalId, setEditingHospitalId] = useState(null);
  const [editedHospitalName, setEditedHospitalName] = useState('');

  // States for displaying doctors for a selected hospital
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalDoctors, setHospitalDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setIsLoading(true);
    try {
      const response = await getHospitals();
      setHospitals(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des hôpitaux.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorsForHospital = async (hospital) => {
    setIsLoadingDoctors(true);
    try {
      const response = await getDoctorsByHospital(hospital.id);
      setHospitalDoctors(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des docteurs pour cet hôpital.');
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const handleAddHospital = async () => {
    if (!newHospital.trim()) {
      toast.error('Veuillez entrer un nom d\'hôpital.');
      return;
    }
    try {
      await createHospital({ name: newHospital });
      toast.success('Hôpital ajouté avec succès.');
      setNewHospital('');
      fetchHospitals();
      setActiveTab('list');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'hôpital.');
    }
  };

  const handleHospitalClick = async (hospital) => {
    // Set the selected hospital and fetch its doctors
    setSelectedHospital(hospital);
    await fetchDoctorsForHospital(hospital);
  };

  const handleEditHospital = (hospital) => {
    setEditingHospitalId(hospital.id);
    setEditedHospitalName(hospital.name);
  };

  const handleUpdateHospital = async (hospitalId) => {
    if (!editedHospitalName.trim()) {
      toast.error('Le nom de l\'hôpital ne peut pas être vide.');
      return;
    }
    try {
      await updateHospital(hospitalId, { name: editedHospitalName });
      toast.success('Hôpital mis à jour avec succès.');
      setEditingHospitalId(null);
      setEditedHospitalName('');
      fetchHospitals();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'hôpital.');
    }
  };

  const handleCancelEdit = () => {
    setEditingHospitalId(null);
    setEditedHospitalName('');
  };

  const handleDeleteHospital = async (hospitalId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet hôpital ?')) {
      try {
        await deleteHospital(hospitalId);
        toast.success('Hôpital supprimé avec succès.');
        fetchHospitals();
      } catch (error) {
        toast.error('Erreur lors de la suppression de l\'hôpital.');
      }
    }
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
            <FaHospitalSymbol className="text-blue-600 dark:text-blue-300 size-6" />
          </div>
          {selectedHospital ? (
            <div>
              <div className="flex items-center mb-1">
                <Link 
                  to="/hospitals" 
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedHospital(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mr-2"
                >
                  <FaArrowLeft className="mr-1" size={12} />
                  <span className="text-sm">Hôpitaux</span>
                </Link>
                <span className="text-gray-500 dark:text-gray-400 text-sm">/</span>
                <span className="text-gray-700 dark:text-gray-300 ml-2 text-sm font-medium">
                  {selectedHospital.name}
                </span>
              </div>
              <h1 className="text-blue-900 dark:text-blue-300 text-2xl font-bold">Gestion des Docteurs</h1>
            </div>
          ) : (
            <h1 className="text-blue-900 dark:text-blue-300 text-2xl font-bold">Gestion des Hôpitaux</h1>
          )}
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
          onClick={() => {
            setActiveTab('list');
            setSelectedHospital(null);
          }}
        >
          Liste des Hôpitaux
        </button>
        <button
          className={`py-2 px-6 -mb-px text-sm font-medium transition-all duration-200 ease-in-out ${
            activeTab === 'create'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-b-2 border-transparent text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300'
          }`}
          onClick={() => {
            setActiveTab('create');
            setSelectedHospital(null);
          }}
        >
          Ajouter un Hôpital
        </button>
      </div>

      {activeTab === 'list' && (
        <>
          {selectedHospital ? (
            // Doctors view for the selected hospital
            <div className="p-4">
              {isLoadingDoctors ? (
                <div className="flex justify-center my-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : hospitalDoctors.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">Aucun docteur trouvé pour cet hôpital.</p>
              ) : (
                <ul className="space-y-2">
                  {hospitalDoctors.map((doctor) => (
                    <li key={doctor.id} className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm">
                      <p className="text-gray-800 dark:text-gray-200">{doctor.email}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            // Hospitals list view
            <div className="p-4">
              {/* Search bar */}
              <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Rechercher un hôpital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isLoading ? (
                <div className="flex justify-center my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredHospitals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchTerm ? 'Aucun hôpital ne correspond à votre recherche.' : 'Aucun hôpital trouvé.'}
                  </p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    <FaPlus className="mr-2" /> Ajouter un hôpital
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredHospitals.map((hospital) => (
                    <div
                      key={hospital.id}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-all duration-200"
                    >
                      <div className="p-4 flex justify-between items-center">
                        {editingHospitalId === hospital.id ? (
                          // Edit Mode
                          <div className="flex-1">
                            <input
                              type="text"
                              value={editedHospitalName}
                              onChange={(e) => setEditedHospitalName(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
                            />
                          </div>
                        ) : (
                          // Display Mode with click to show doctors
                          <div
                            onClick={() => handleHospitalClick(hospital)}
                            className="flex-1 font-medium text-gray-800 dark:text-white cursor-pointer"
                          >
                            {hospital.name}
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          {editingHospitalId === hospital.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateHospital(hospital.id)}
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
                                onClick={() => handleEditHospital(hospital)}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteHospital(hospital.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleHospitalClick(hospital)}
                            className="flex items-center text-blue-600 dark:text-blue-400 text-sm"
                          >
                            Voir les docteurs <FaArrowRight className="ml-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'create' && (
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Ajouter un nouvel hôpital</h2>
          <div className="mb-6">
            <label htmlFor="hospital-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nom de l'hôpital
            </label>
            <input
              type="text"
              id="hospital-name"
              value={newHospital}
              onChange={(e) => setNewHospital(e.target.value)}
              placeholder="Exemple: Hôpital Saint-Louis"
              className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleAddHospital}
              className="flex-1 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-200"
            >
              Ajouter l'hôpital
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

export default Hospital;
