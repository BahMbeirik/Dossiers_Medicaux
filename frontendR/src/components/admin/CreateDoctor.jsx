/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getHospitals, createDoctor } from '../../services/AdminService';
import { toast } from 'react-hot-toast';
import {FaUserPlus,FaUsers} from "react-icons/fa";
const AddDoctor = () => {
  const [hospitals, setHospitals] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    email: '',
    hospital: '',
  });

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

  const handleAddDoctor = async () => {
    if (!newDoctor.email || !newDoctor.hospital) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    try {
      await createDoctor(newDoctor);
      toast.success('Docteur ajouté avec succès.');
      setNewDoctor({ email: '', hospital: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du docteur.');
    }
  };

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-4xl">
              <div className="flex items-center mb-6">
                <FaUserPlus className="text-blue-900 mr-2 size-10" />
                <h1 className="text-center text-blue-900 dark:text-blue-300 text-3xl">Ajouter un Docteur</h1>
              </div>
              <div className="flex border-b mb-4">
                  <button className='border-b-2 border-blue-500 text-blue-500'  >
                  Créer un Docteur
                  </button>
                </div>
        <div className="space-y-4">
          <input
            type="email"
            value={newDoctor.email}
            onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
            placeholder="Email du docteur"
            className="p-2 border rounded-lg w-full"
          />
          
          <select
            value={newDoctor.hospital}
            onChange={(e) => setNewDoctor({ ...newDoctor, hospital: e.target.value })}
            className="p-2 border rounded-lg w-full"
          >
            <option value="">Sélectionnez un hôpital</option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
        <button
          onClick={handleAddDoctor}
          className="text-white bg-gradient-to-br from-blue-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mt-5 w-full"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default AddDoctor;