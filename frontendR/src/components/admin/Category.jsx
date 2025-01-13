/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getCategories, createCategory } from '../../services/AdminService';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { BiSolidCategoryAlt } from "react-icons/bi";
const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // State to manage active tab

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des catégories.');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory) {
      toast.error('Veuillez entrer un nom de catégorie.');
      return;
    }

    try {
      await createCategory({ name: newCategory });
      toast.success('Catégorie ajoutée avec succès.');
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la catégorie.');
    }
  };

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-4xl">
          <div className="flex items-center mb-6">
            <BiSolidCategoryAlt className="text-blue-900 mr-2 size-10" />
            <h1 className="text-center text-blue-900 dark:text-blue-300 text-3xl">Gestion des Catégories</h1>
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
              Les Catégories
            </button>
            <button
              className={`py-2 px-4 -mb-px text-sm font-medium ${
                activeTab === 'create'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab('create')}
            >
            Créer une Catégorie
            </button>
          </div>
          </div>

          {activeTab === 'list' && (
            <div className=" p-4 ">
            {categories.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">Aucun categorie trouvé.</p>
            ) : (
            <div>
              {categories.map((category) => (
                <div key={category.id} className="mb-2">
                  <Link to={`/category/${category.id}/fields`} className="flex items-center text-lg font-bold text-gray-800 dark:text-white">
                  <div className="bg-gray-50 dark:bg-gray-700 border-b-2 border-blue-500  shadow-sm w-full  p-1 cursor-pointer hover:shadow-md transition-shadow duration-200">
                    {category.name}
                  </div>
                  </Link>
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
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}   placeholder="Nom de la catégorie"
          id="small-input" className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
      
        <button
          onClick={handleAddCategory}
          className="text-white bg-gradient-to-br from-blue-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mt-5 w-full"
        >
          Ajouter
        </button>
      </div>
      ) }
      
    </div>
  );
};

export default Category;