import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFields, createField, updateField, deleteField } from '../../services/AdminService';
import { toast } from 'react-hot-toast';
import { RiInputField } from "react-icons/ri";
import { FaSearch, FaPlus, FaPencilAlt, FaTrash, FaArrowLeft } from 'react-icons/fa';

const Field = () => {
  const { categories_pk } = useParams();
  const [fields, setFields] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [newField, setNewField] = useState({ 
    name: '', 
    field_type: 'text', 
    required: false,
    options: []  // Only used if field_type is "select"
  });
  const [activeTab, setActiveTab] = useState('list');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for edit mode
  const [editMode, setEditMode] = useState(false);
  const [editFieldId, setEditFieldId] = useState(null);
  const [editFieldData, setEditFieldData] = useState({ 
    name: '', 
    field_type: 'text', 
    required: false,
    options: []
  });
  
  // For delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);

  useEffect(() => {
    fetchFields();
    fetchCategoryName();
  }, [categories_pk]);

  const fetchCategoryName = async () => {
    // Simulate fetching category name
    try {
      setCategoryName("Catégorie " + categories_pk); // Placeholder
    } catch (error) {
      console.error("Error fetching category name:", error);
    }
  };

  const fetchFields = async () => {
    setIsLoading(true);
    try {
      const response = await getFields(categories_pk);
      setFields(response.data);
    } catch (error) {
      toast.error('Erreur lors de la récupération des champs.');
    } finally {
      setIsLoading(false);
    }
  };

  // Option handling for new field
  const handleAddOption = () => {
    setNewField({
      ...newField,
      options: [...newField.options, { value: '', label: '' }]
    });
  };

  const handleOptionChange = (index, key, value) => {
    const updatedOptions = newField.options.map((opt, i) =>
      i === index ? { ...opt, [key]: value } : opt
    );
    setNewField({ ...newField, options: updatedOptions });
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = newField.options.filter((_, i) => i !== index);
    setNewField({ ...newField, options: updatedOptions });
  };

  const handleAddField = async () => {
    if (!newField.name) {
      toast.error('Veuillez entrer un nom de champ.');
      return;
    }
    // If field type is select, ensure options are provided.
    if (newField.field_type === 'select' && newField.options.length === 0) {
      toast.error('Veuillez ajouter au moins une option pour le champ de type "select".');
      return;
    }
    setIsLoading(true);
    try {
      await createField(categories_pk, newField);
      toast.success('Champ ajouté avec succès.');
      setNewField({ name: '', field_type: 'text', required: false, options: [] });
      fetchFields();
      setActiveTab('list');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du champ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (field) => {
    setEditMode(true);
    setEditFieldId(field.id);
    setEditFieldData({
      name: field.name,
      field_type: field.field_type,
      required: field.required,
      options: field.options || []
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditFieldId(null);
    setEditFieldData({ name: '', field_type: 'text', required: false, options: [] });
  };

  const handleUpdateField = async () => {
    if (!editFieldData.name) {
      toast.error('Veuillez entrer un nom de champ.');
      return;
    }
    try {
      await updateField(categories_pk, editFieldId, editFieldData);
      toast.success('Champ mis à jour avec succès.');
      fetchFields();
      handleCancelEdit();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du champ.');
    }
  };

  const handleDeleteClick = (field) => {
    setFieldToDelete(field);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteField(categories_pk, fieldToDelete.id);
      toast.success('Champ supprimé avec succès.');
      fetchFields();
      setShowDeleteConfirm(false);
      setFieldToDelete(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression du champ.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setFieldToDelete(null);
  };

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFieldTypeIcon = (type) => {
    switch(type) {
      case 'text': return '🔤';
      case 'number': return '🔢';
      case 'date': return '📅';
      case 'textarea': return '📝';
      case 'select': return '📋';
      default: return '📄';
    }
  };

  const getFieldTypeName = (type) => {
    switch(type) {
      case 'text': return 'Texte';
      case 'number': return 'Nombre';
      case 'date': return 'Date';
      case 'textarea': return 'Zone de texte';
      case 'select': return 'Liste déroulante';
      default: return type;
    }
  };

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
            {/* Optionally display an icon if needed */}
          </div>
          <div>
            <div className="flex items-center mb-1">
              <Link to="/categories" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mr-2">
                <FaArrowLeft className="mr-1" size={12} />
                <span className="text-sm">Catégories</span>
              </Link>
              <span className="text-gray-500 dark:text-gray-400 text-sm">/</span>
              <span className="text-gray-700 dark:text-gray-300 ml-2 text-sm font-medium">Catégorie {categories_pk}</span>
            </div>
            <h1 className="text-blue-900 dark:text-blue-300 text-2xl font-bold">Gestion des Champs</h1>
          </div>
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
          Liste des Champs
        </button>
        <button
          className={`py-2 px-6 -mb-px text-sm font-medium transition-all duration-200 ease-in-out ${
            activeTab === 'create'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-b-2 border-transparent text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300'
          }`}
          onClick={() => setActiveTab('create')}
        >
          Ajouter un Champ
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
              placeholder="Rechercher un champ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredFields.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'Aucun champ ne correspond à votre recherche.' : 'Aucun champ trouvé.'}
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                <FaPlus className="mr-2" /> Ajouter un champ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredFields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200"
                >
                  {editMode && editFieldId === field.id ? (
                    <div className="p-4">
                      <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nom du champ
                        </label>
                        <input
                          type="text"
                          value={editFieldData.name}
                          onChange={(e) => setEditFieldData({ ...editFieldData, name: e.target.value })}
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Type de champ
                        </label>
                        <select
                          value={editFieldData.field_type}
                          onChange={(e) => setEditFieldData({ ...editFieldData, field_type: e.target.value })}
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="text">Texte</option>
                          <option value="number">Nombre</option>
                          <option value="date">Date</option>
                          <option value="textarea">Zone de texte</option>
                          <option value="select">Liste déroulante</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={editFieldData.required}
                            onChange={(e) => setEditFieldData({ ...editFieldData, required: e.target.checked })}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Champ requis</span>
                        </label>
                      </div>
                      {editFieldData.field_type === 'select' && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Options</h3>
                          {editFieldData.options.map((opt, index) => (
                            <div key={index} className="flex space-x-2 mb-2">
                              <input
                                type="text"
                                placeholder="Valeur"
                                value={opt.value}
                                onChange={(e) => {
                                  const updatedOptions = [...editFieldData.options];
                                  updatedOptions[index].value = e.target.value;
                                  setEditFieldData({ ...editFieldData, options: updatedOptions });
                                }}
                                className="w-1/2 p-2 border border-gray-300 rounded-lg"
                              />
                              <input
                                type="text"
                                placeholder="Label"
                                value={opt.label}
                                onChange={(e) => {
                                  const updatedOptions = [...editFieldData.options];
                                  updatedOptions[index].label = e.target.value;
                                  setEditFieldData({ ...editFieldData, options: updatedOptions });
                                }}
                                className="w-1/2 p-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                          ))}
                          <button
                            onClick={() =>
                              setEditFieldData({
                                ...editFieldData,
                                options: [...editFieldData.options, { value: '', label: '' }]
                              })
                            }
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <FaPlus className="inline mr-1" /> Ajouter une option
                          </button>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateField}
                          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{getFieldTypeIcon(field.field_type)}</span>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-white">{field.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {getFieldTypeName(field.field_type)}
                            </span>
                            <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                            <span className={`text-xs ${field.required ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                              {field.required ? 'Requis' : 'Optionnel'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditClick(field)}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="Modifier"
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(field)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
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
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Ajouter un nouveau champ</h2>
          
          <div className="mb-4">
            <label htmlFor="field-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nom du champ
            </label>
            <input
              type="text"
              id="field-name"
              value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              placeholder="Entrez le nom du champ"
              className="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="field-type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Type de champ
            </label>
            <div className="relative">
              <select
                id="field-type"
                value={newField.field_type}
                onChange={(e) => setNewField({ ...newField, field_type: e.target.value, options: [] })}
                className="block appearance-none w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white pr-8"
              >
                <option value="text">Texte</option>
                <option value="number">Nombre</option>
                <option value="date">Date</option>
                <option value="textarea">Zone de texte</option>
                <option value="select">Liste déroulante</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={newField.required}
                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Champ requis</span>
            </label>
          </div>
          
          {newField.field_type === 'select' && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Options</h3>
              {newField.options.map((opt, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Valeur"
                    value={opt.value}
                    onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Label"
                    value={opt.label}
                    onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddOption}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <FaPlus className="inline mr-1" /> Ajouter une option
              </button>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={handleAddField}
              disabled={isLoading}
              className="flex-1 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></span>
                  Traitement...
                </>
              ) : (
                <>Ajouter le champ</>
              )}
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
              Êtes-vous sûr de vouloir supprimer le champ "{fieldToDelete?.name}"? Cette action est irréversible.
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

export default Field;
