import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addPatient } from "../../services/patientService";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUserPlus, FaSave, FaMale, FaFemale } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const SexRadio = ({ formik }) => {
  const sexOptions = [
    { 
      value: 'M', 
      label: 'Masculin', 
      icon: FaMale, 
      selectedBg: 'bg-blue-100 dark:bg-blue-900', 
      selectedBorder: 'border-blue-500',
      selectedIconColor: 'text-blue-600',
      selectedTextColor: 'text-blue-700 dark:text-blue-300',
      hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-800'
    },
    { 
      value: 'F', 
      label: 'Féminin', 
      icon: FaFemale, 
      selectedBg: 'bg-pink-100 dark:bg-pink-900', 
      selectedBorder: 'border-pink-500',
      selectedIconColor: 'text-pink-600',
      selectedTextColor: 'text-pink-700 dark:text-pink-300',
      hoverBg: 'hover:bg-pink-50 dark:hover:bg-pink-800'
    }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Sexe
      </label>
      <div className="flex space-x-4 justify-center">
        {sexOptions.map((option) => (
          <label 
            key={option.value} 
            className={`
              relative flex flex-col items-center cursor-pointer 
              p-4 rounded-lg transition-all duration-300 
              ${formik.values.sex === option.value 
                ? `${option.selectedBg} ${option.selectedBorder} border-2` 
                : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent'}
              ${option.hoverBg}
            `}
          >
            <input
              type="radio"
              name="sex"
              value={option.value}
              checked={formik.values.sex === option.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="hidden"
            />
            <option.icon 
              className={`
                w-10 h-10 mb-2 
                ${formik.values.sex === option.value 
                  ? option.selectedIconColor
                  : 'text-gray-400'}
              `} 
            />
            <span className={`
              text-sm font-semibold 
              ${formik.values.sex === option.value 
                ? option.selectedTextColor
                : 'text-gray-600 dark:text-gray-300'}
            `}>
              {option.label}
            </span>
            {formik.values.sex === option.value && (
              <span className="absolute top-1 right-1 text-green-500">
                ✓
              </span>
            )}
          </label>
        ))}
      </div>
      {formik.touched.sex && formik.errors.sex && (
        <p className="text-red-500 text-xs mt-1 text-center">{formik.errors.sex}</p>
      )}
    </div>
  );
};

const AddPatient = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      numero_identite: '',
      nom: '',
      prenom: '',
      date_naissance: '',
      sex: '',
      numero_telephone: '',
    },
    validationSchema: Yup.object({
      numero_identite: Yup.string()
        .matches(/^\d{10}$/, "Le numéro d'identité doit contenir exactement 10 chiffres.")
        .required("Numéro d'identité est requis."),
      nom: Yup.string().required("Nom est requis."),
      prenom: Yup.string().required("Prénom est requis."),
      date_naissance: Yup.date()
        .max(new Date(Date.now() - 86400000), "La date de naissance doit être dans le passé.")
        .required("Date de naissance est requise."),
      sex: Yup.string()
        .oneOf(['M', 'F'], "Veuillez sélectionner un sexe valide.")
        .required("Sexe est requis."),
      numero_telephone: Yup.string()
        .matches(/^[2-4]\d{7}$/, "Le numéro de téléphone doit contenir exactement 8 chiffres et commencer par 2, 3 ou 4.")
        .required("Numéro de téléphone est requis."),
    }),
    onSubmit: async (values) => {
      try {
        await addPatient(values);
        toast.success('Patient ajouté avec succès !', {
          style: {
            background: '#10B981',
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#10B981',
          },
        });
        navigate('/home');
      } catch (error) {
        console.error('Error:', error.message);
        toast.error("Une erreur s'est produite lors de l'ajout du patient. Veuillez réessayer.", {
          style: {
            background: '#EF4444',
            color: 'white',
          },
        });
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 shadow-md rounded-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center">
            <FaUserPlus className="mr-3 text-blue-600 dark:text-indigo-400" />
            Ajouter un Patient
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Veuillez remplir tous les champs du formulaire
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Previous input fields */}
          {['numero_identite', 'nom', 'prenom', 'date_naissance', 'numero_telephone'].map((field) => (
            <div key={field} className="relative">
              <input
                type={field === 'date_naissance' ? 'date' : 'text'}
                name={field}
                id={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                className={`w-full px-3 py-2 border-b-2 transition-colors duration-300 
                  ${formik.touched[field] && formik.errors[field] 
                    ? 'border-red-500 focus:border-red-700' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-indigo-600'} 
                  bg-transparent text-gray-900 dark:text-white text-sm 
                  focus:outline-none peer`}
                placeholder=" "
              />
              <label 
                htmlFor={field}
                className={`absolute left-0 -top-3.5 text-sm transition-all duration-300 
                  ${formik.values[field] 
                    ? 'text-blue-600 dark:text-indigo-400 scale-75' 
                    : 'text-gray-500 dark:text-gray-400 peer-focus:text-blue-600'}`}
              >
                {field === 'numero_identite' ? "Numéro d'identité" 
                  : field === 'numero_telephone' ? "Numéro de téléphone"
                  : field === 'date_naissance' ? "Date de naissance"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {formik.touched[field] && formik.errors[field] && (
                <p className="text-red-500 text-xs mt-1">{formik.errors[field]}</p>
              )}
            </div>
          ))}

          {/* Creative Sex Radio Component */}
          <SexRadio formik={formik} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${formik.isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
          >
            {formik.isSubmitting ? (
              <span>Ajout en cours...</span>
            ) : (
              <>
                <FaSave className="mr-2 -ml-1" />
                Ajouter le Patient
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;