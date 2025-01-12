/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFields, createField } from '../../services/AdminService';
import { toast } from 'react-hot-toast';
import { RiInputField } from "react-icons/ri";

const Field = () => {
  const { categories_pk } = useParams();
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ name: '', field_type: 'text', required: false });
  const [activeTab, setActiveTab] = useState('list'); // State to manage active tab

  useEffect(() => {
    fetchFields();
  }, [categories_pk]);

  const fetchFields = async () => {
    try {
      const response = await getFields(categories_pk);
      setFields(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des champs.');
    }
  };

  const handleAddField = async () => {
    if (!newField.name) {
      toast.error('Veuillez entrer un nom de champ.');
      return;
    }

    try {
      await createField(categories_pk, newField);
      toast.success('Champ ajouté avec succès.');
      setNewField({ name: '', field_type: 'text', required: false });
      fetchFields();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du champ.');
    }
  };

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-4xl">
              <div className="flex items-center mb-6">
                <RiInputField className="text-blue-900 mr-2 size-10" />
                <h1 className="text-center text-blue-900 dark:text-blue-300 text-3xl">Gestion des Champs</h1>
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
                  Les Champs
                </button>
                <button
                  className={`py-2 px-4 -mb-px text-sm font-medium ${
                    activeTab === 'create'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('create')}
                >
                Créer une Champs
                </button>
              </div>
              </div>
              
              {activeTab === 'list' && (
                <div className=" p-4 ">
                {fields.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400">Aucun fields trouvé.</p>
                ) : (
                <div>
                {fields.map((field) => (
                  <div key={field.id} className="mb-2">
                    <div className="bg-gray-50 dark:bg-gray-700 border-b-2 border-blue-500  shadow-sm w-full  p-1 cursor-pointer hover:shadow-md transition-shadow duration-200">
                      {field.name} ({field.field_type}) - {field.required ? 'Requis' : 'Non requis'}
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          )}


          {activeTab === 'create' &&(
            <div className="mb-4">
            <div>
            <label for="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom de la catégorie</label>
            <input type="text" 
            value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })} placeholder="Nom du champ"
              id="small-input" className="block w-full mb-2 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
        <div className='flex'>
        <select
          value={newField.field_type}
          onChange={(e) => setNewField({ ...newField, field_type: e.target.value })}
          className="block w-4/5 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="textarea">Textarea</option>
        </select>
        <label className="ml-20 mt-2">
          <input
            type="checkbox"
            checked={newField.required}
            onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
            className='mr-2'
          />
          Requis
        </label>
        </div>
        <button
          onClick={handleAddField}
          className="text-white bg-gradient-to-br from-blue-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mt-5 w-full"
        >
          Ajouter
        </button>
      </div>
      ) }
    </div>
  );
};

export default Field;