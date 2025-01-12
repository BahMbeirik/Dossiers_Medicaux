/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
// src/components/document/CreateDocument.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories, createDocument } from "../../services/documentService";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FaFileMedical } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import CategorySelection from './CategorySelection';
import DocumentForm from './DocumentForm';
import LastDocument from './LastDocument'; // Import the new component

const CreateDocument = () => {
  const { id: patientId } = useParams(); // Patient ID from route
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [doctorId, setDoctorId] = useState(null); // Retrieve from auth context or storage
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Loading state
  const [activeTab, setActiveTab] = useState('create'); // State to manage active tab

  useEffect(() => {
    fetchCategories();
    retrieveDoctorId();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des catégories.");
      console.error('CreateDocument: Error fetching categories', error);
    }
  };

  const retrieveDoctorId = () => {
    // Adjust based on your auth setup
    const id = localStorage.getItem("user_id"); // Example
    const parsedId = id ? parseInt(id) : null;
    setDoctorId(parsedId);
    setIsAuthLoading(false); // Set loading to false after retrieving
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const fields = Array.isArray(category.fields) ? category.fields : [];
    setFormFields(fields);
    setActiveTab('create'); // Reset to 'create' tab when a new category is selected
  };

  if (isAuthLoading) {
    return <div className="text-center mt-10">Chargement de l'authentification...</div>;
  }

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-4xl">
      <div className="flex items-center mb-6">
        <FaFileMedical className="text-blue-500 mr-2" />
        <h1 className="text-center text-blue-900 dark:text-blue-300 text-3xl">Gérer les Documents</h1>
      </div>

      {!selectedCategory ? (
        <CategorySelection categories={categories} onSelect={handleCategorySelect} />
      ) : (
        <div>
          {/* Tabs Navigation */}
          <div className="flex border-b mb-4">
            <button
              className={`py-2 px-4 -mb-px text-sm font-medium ${
                activeTab === 'create'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab('create')}
            >
              Créer un Document
            </button>
            <button
              className={`py-2 px-4 -mb-px text-sm font-medium ${
                activeTab === 'last'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab('last')}
            >
              Dernier Résultat
            </button>
          </div>

          {/* Tabs Content */}
          {activeTab === 'create' && (
            <Formik
              initialValues={{
                category_id: selectedCategory.id,
                doctor_id: doctorId || '',
                result: formFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}), // Initialize all result fields to ''
              }}
              validationSchema={Yup.object({
                category_id: Yup.number().required("Sélectionnez une catégorie."),
                doctor_id: Yup.number().required("Identifiant du médecin requis."),
                result: Yup.object().shape(
                  formFields.reduce((shape, field) => {
                    if (field.required) {
                      shape[field.name] = Yup.string().required(`${field.name} est requis.`);
                    } else {
                      shape[field.name] = Yup.string();
                    }
                    return shape;
                  }, {})
                ),
              })}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const documentData = {
                    patient_id: parseInt(patientId),
                    category_id: values.category_id,
                    doctor_id: parseInt(values.doctor_id),
                    result: values.result,
                  };
                  const response = await createDocument(documentData);
                  toast.success('Document créé avec succès !');
                  resetForm();
                  // Optionally, fetch the last document again
                } catch (error) {
                  toast.error("Erreur lors de la création du document.");
                  console.error('CreateDocument: Error creating document', error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {(formikProps) => (
                <DocumentForm formFields={formFields} formik={formikProps} onBack={() => setSelectedCategory(null)} />
              )}
            </Formik>
          )}

          {activeTab === 'last' && (
            <div className="mt-4">
              <LastDocument patientId={patientId} categoryId={selectedCategory.id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateDocument;
