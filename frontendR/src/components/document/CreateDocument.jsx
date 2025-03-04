/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories, createDocument } from "../../services/documentService";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FaFileMedical, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import CategorySelection from './CategorySelection';
import DocumentForm from './DocumentForm';
import LastDocument from './LastDocument';

// Helper function to convert a File to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    
    // Ensure file is a File object
    if (!(file instanceof File)) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const CreateDocument = () => {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('create');

  useEffect(() => {
    fetchCategories();
    retrieveDoctorId();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      toast.error("Erreur lors de la récupération des catégories.");
      console.error('CreateDocument: Error fetching categories', error);
      setCategories([]);
    }
  };

  const retrieveDoctorId = () => {
    const id = localStorage.getItem("user_id");
    const parsedId = id ? parseInt(id) : null;
    setDoctorId(parsedId);
    setIsAuthLoading(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const fields = Array.isArray(category?.fields) ? category.fields : [];
    setFormFields(fields);
    setActiveTab('create');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setActiveTab('create');
  };

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <FaFileMedical className="text-4xl text-blue-500 mx-auto" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Chargement de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-4xl">
      <div className="flex items-center mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <FaFileMedical className="text-blue-500 mr-4 text-2xl" />
        <h1 className="text-center text-blue-900 dark:text-blue-300 text-2xl font-semibold flex-grow">
          Gérer les Documents
        </h1>
      </div>

      {!selectedCategory ? (
        <CategorySelection categories={categories} onSelect={handleCategorySelect} />
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Tabs Navigation with Back Arrow */}
          <div className="flex items-center border-b mb-4 bg-gray-100 dark:bg-gray-900/20 rounded-t-lg">
            {/* Back Arrow */}
            <button 
              onClick={handleBackToCategories}
              className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-tl-lg"
              title="Retour aux catégories"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* Tabs */}
            <div className="flex flex-grow">
              <button
                className={`py-3 px-4 text-sm font-medium flex-1 transition-colors ${
                  activeTab === 'create'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500 dark:bg-blue-900/30'
                    : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('create')}
              >
                Créer un Document
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium flex-1 transition-colors ${
                  activeTab === 'last'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500 dark:bg-blue-900/30'
                    : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('last')}
              >
                Derniers Résultats
              </button>
            </div>
          </div>

          {/* Tabs Content */}
          {activeTab === 'create' && (
            <Formik
              initialValues={{
                category_id: selectedCategory?.id || '',
                doctor_id: doctorId || '',
                result: formFields.reduce((acc, field) => ({ 
                  ...acc, 
                  [field.name]: '' 
                }), {}),
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
                  const processedResult = { ...values.result };
                  // Iterate over each field to handle files
                  for (const key in processedResult) {
                    if (processedResult.hasOwnProperty(key)) {
                      const value = processedResult[key];
                      if (value instanceof File) {
                        const base64 = await fileToBase64(value);
                        processedResult[key] = base64; // Replace File with Base64 string
                      }
                    }
                  }

                  const documentData = {
                    patient_id: parseInt(patientId),
                    category_id: values.category_id,
                    doctor_id: parseInt(values.doctor_id),
                    result: processedResult,
                  };
                  const response = await createDocument(documentData);
                  
                  toast.success('Document créé avec succès !');
                  resetForm();
                } catch (error) {
                  toast.error("Erreur lors de la création du document.");
                  console.error('CreateDocument: Error creating document', error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {(formikProps) => (
                <DocumentForm 
                  formFields={formFields} 
                  formik={formikProps} 
                  onBack={handleBackToCategories} 
                />
              )}
            </Formik>
          )}

          {activeTab === 'last' && (
            <div className="p-4">
              <LastDocument patientId={patientId} categoryId={selectedCategory?.id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateDocument;