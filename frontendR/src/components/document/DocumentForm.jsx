/* src/components/document/DocumentForm.jsx */
import React from 'react';
import { FaFileMedical, FaArrowLeft, FaFileUpload } from 'react-icons/fa';
import { Form, Field, ErrorMessage } from 'formik';

const DocumentForm = ({ formFields, formik, onBack }) => {
  // Helper function to render input fields based on type
  const renderInputField = (field) => {
    const baseClasses = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white";
    
    switch (field.field_type) {
      case 'textarea':
        return (
          <Field
            as="textarea"
            id={field.name}
            name={`result.${field.name}`}
            className={baseClasses}
            rows="4"
            required={field.required}
            placeholder={`Entrez ${field.name}`}
          />
        );
      
      case 'select':
        return (
          <Field
            as="select"
            id={field.name}
            name={`result.${field.name}`}
            className={baseClasses}
            required={field.required}
          >
            <option value="">-- Sélectionnez une option --</option>
            {Array.isArray(field.options) &&
              field.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
          </Field>
        );
      
      case 'file':
        return (
          <div className="flex items-center">
            <Field
              type="file"
              id={field.name}
              name={`result.${field.name}`}
              className={`${baseClasses} file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-blue-100`}
              required={field.required}
              accept={
                Array.isArray(field.file_types)
                  ? field.file_types.map((ext) => `.${ext}`).join(',')
                  : undefined
              }
            />
          </div>
        );
      
      default:
        return (
          <Field
            id={field.name}
            name={`result.${field.name}`}
            type={field.field_type}
            className={baseClasses}
            required={field.required}
            placeholder={`Entrez ${field.name}`}
          />
        );
    }
  };

  return (
    <div className="p-4">

      
      <Form className="space-y-6">
        {Array.isArray(formFields) && formFields.length > 0 ? (
          formFields.map((field) => (
            <div key={field.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <label 
                htmlFor={field.name} 
                className="block text-gray-700 dark:text-gray-300 mb-2 font-medium"
              >
                {field.name} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {renderInputField(field)}
              
              <ErrorMessage 
                name={`result.${field.name}`} 
                component="div" 
                className="text-red-500 text-sm mt-2" 
              />
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            Aucun champ disponible pour cette catégorie.
          </p>
        )}
        
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className={`
              flex items-center px-6 py-2 rounded 
              ${formik.isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white'}
              focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors
            `}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <>
                <span className="animate-pulse mr-2">Création en cours...</span>
              </>
            ) : (
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