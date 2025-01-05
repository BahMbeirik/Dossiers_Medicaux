/* src/components/document/DocumentForm.jsx */
import React from 'react';
import { FaFileMedical, FaArrowLeft } from 'react-icons/fa';
import { Form, Field, ErrorMessage } from 'formik';

const DocumentForm = ({ formFields, formik, onBack }) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 mr-4"
        >
          <FaArrowLeft className="mr-1" />
          Retour
        </button>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Créer un document:</h2>
      </div>
      <Form className="space-y-4">
        {Array.isArray(formFields) && formFields.length > 0 ? (
          formFields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.name} className="block text-gray-700 dark:text-gray-300 mb-1">
                {field.name} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.field_type === 'textarea' ? (
                <Field
                  as="textarea"
                  id={field.name}
                  name={`result.${field.name}`}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows="4"
                  required={field.required}
                />
              ) : (
                <Field
                  id={field.name}
                  name={`result.${field.name}`}
                  type={field.field_type}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required={field.required}
                />
              )}
              <ErrorMessage name={`result.${field.name}`} component="div" className="text-red-500 text-sm mt-1" />
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Aucun champ disponible pour cette catégorie.</p>
        )}
        <div className="flex justify-end">
          <button
            type="submit"
            className={`flex items-center px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ${
              formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Création en cours...' : (
              <>
                <FaFileMedical className="mr-2" />
                Créer
              </>
            )}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default DocumentForm;
  