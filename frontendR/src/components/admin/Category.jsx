/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/AdminService';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaSearch, FaPlus, FaPencilAlt, FaTrash, FaArrowRight } from 'react-icons/fa';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des catégories.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Veuillez entrer un nom de catégorie.');
      return;
    }

    try {
      await createCategory({ name: newCategory });
      toast.success('Catégorie ajoutée avec succès.');
      setNewCategory('');
      fetchCategories();
      setActiveTab('list'); // Switch back to list view after adding
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la catégorie.');
    }
  };

  const handleEditClick = (e, category) => {
    e.preventDefault(); // Prevent navigation to fields page
    setEditMode(true);
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditCategoryId(null);
    setEditCategoryName('');
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryName.trim()) {
      toast.error('Veuillez entrer un nom de catégorie.');
      return;
    }

    try {
      await updateCategory(editCategoryId, { name: editCategoryName });
      toast.success('Catégorie mise à jour avec succès.');
      fetchCategories();
      handleCancelEdit();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la catégorie.');
    }
  };

  const handleDeleteClick = (e, category) => {
    e.preventDefault(); // Prevent navigation to fields page
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(categoryToDelete.id);
      toast.success('Catégorie supprimée avec succès.');
      fetchCategories();
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression de la catégorie.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
            <BiSolidCategoryAlt className="text-blue-600 dark:text-blue-300 size-6" />
          </div>
          <h1 className="text-blue-900 dark:text-blue-300 text-2xl font-bold">Gestion des Catégories</h1>
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
          Liste des Catégories
        </button>
        <button
          className={`py-2 px-6 -mb-px text-sm font-medium transition-all duration-200 ease-in-out ${
            activeTab === 'create'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-b-2 border-transparent text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300'
          }`}
          onClick={() => setActiveTab('create')}
        >
          Ajouter une Catégorie
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
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'Aucune catégorie ne correspond à votre recherche.' : 'Aucune catégorie trouvée.'}
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                <FaPlus className="mr-2" /> Ajouter une catégorie
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200"
                >
                  {editMode && editCategoryId === category.id ? (
                    <div className="p-4 flex items-center">
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="block flex-1 p-2 mr-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateCategory}
                          className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 flex justify-between items-center">
                      <Link 
                        to={`/category/${category.id}/fields`} 
                        className="font-medium text-gray-800 dark:text-white flex-1"
                      >
                        {category.name}
                      </Link>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => handleEditClick(e, category)}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="Modifier"
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(e, category)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                        <Link 
                          to={`/category/${category.id}/fields`}
                          className="flex items-center text-blue-600 dark:text-blue-400 text-sm"
                        >
                          Voir les champs <FaArrowRight className="ml-2" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Ajouter une nouvelle catégorie</h2>
          
          <div className="mb-6">
            <label htmlFor="category-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nom de la catégorie
            </label>
            <input
              type="text"
              id="category-name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Exemple: Catégorie médicale"
              className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleAddCategory}
              className="flex-1 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-200"
            >
              Ajouter la catégorie
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirmer la suppression</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer la catégorie "{categoryToDelete?.name}"? Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Supprimer
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;