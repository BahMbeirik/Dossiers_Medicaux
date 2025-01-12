/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getHospitals, createHospital } from '../../services/AdminService';
import { toast } from 'react-hot-toast';
import { FaHospitalSymbol } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Hospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [newHospital, setNewHospital] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // State to manage active tab
  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await getHospitals();
      setHospitals(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des hôpitaux.');
    }
  };

  const handleAddHospital = async () => {
    if (!newHospital) {
      toast.error('Veuillez entrer un nom d\'hôpital.');
      return;
    }

    try {
      await createHospital({ name: newHospital });
      toast.success('Hôpital ajouté avec succès.');
      setNewHospital('');
      fetchHospitals();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'hôpital.');
    }
  };

  const handleHospitalClick = (hospitalId) => {
    navigate(`/hospitals/${hospitalId}/doctors`);
  };

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-4xl">
      <div className="flex items-center mb-6">
        <FaHospitalSymbol className="text-blue-900 mr-2 size-10" />
        <h1 className="text-center text-blue-900 dark:text-blue-300 text-3xl">Gestion des Hôpitaux</h1>
      </div>
      <div>
        {/* Tabs Navigation */}
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 -mb-px text-sm font-medium ${
              activeTab === 'list'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('list')}
          >
            Les Hôpitaux
          </button>
          <button
            className={`py-2 px-4 -mb-px text-sm font-medium ${
              activeTab === 'create'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('create')}
          >
            Créer un Hôpital
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="p-4">
          {hospitals.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">Aucun hôpital trouvé.</p>
          ) : (
            <div>
              {hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  onClick={() => handleHospitalClick(hospital.id)}
                  className="mb-2 cursor-pointer"
                >
                  <div className="bg-gray-50 dark:bg-gray-700 border-b-2 border-blue-500 shadow-sm w-full p-1 hover:shadow-md transition-shadow duration-200">
                    {hospital.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="mb-4">
          <div>
            <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nom de l'hôpital
            </label>
            <input
              type="text"
              value={newHospital}
              onChange={(e) => setNewHospital(e.target.value)}
              placeholder="Nom de l'hôpital"
              id="small-input"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleAddHospital}
            className="text-white bg-gradient-to-br from-blue-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mt-5 w-full"
          >
            Ajouter
          </button>
        </div>
      )}
    </div>
  );
};

export default Hospital;