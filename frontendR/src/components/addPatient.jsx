/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPatient } from '../services/patientService';

const AddPatient = () => {
  const [patient, setPatient] = useState({
    numero_identite: '',
    nom: '',
    prenom: '',
    date_naissance: '',
    sex: '',
    numero_telephone: '',
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateFields = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'numero_identite') {
      if (value.length !== 10) {
        newErrors.numero_identite = 'Le numéro d\'identité doit contenir exactement 10 chiffres.';
      } else {
        delete newErrors.numero_identite;
      }
    }

    if (name === 'date_naissance') {
      const currentDate = new Date().toISOString().split('T')[0];
      if (value > currentDate) {
        newErrors.date_naissance = 'La date de naissance ne peut pas être dans le futur.';
      } else {
        delete newErrors.date_naissance;
      }
    }

    if (name === 'numero_telephone') {
      if (value.length !== 8 || !['2', '3', '4'].includes(value.charAt(0))) {
        newErrors.numero_telephone = 'Le numéro de téléphone doit contenir exactement 8 chiffres et commencer par 2, 3 ou 4.';
      } else {
        delete newErrors.numero_telephone;
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
    validateFields(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      alert('Veuillez corriger les erreurs avant de soumettre le formulaire.');
      return;
    }

    if (!patient.numero_identite || !patient.nom || !patient.prenom || !patient.numero_telephone || !patient.date_naissance || !patient.sex) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      console.log('Data sent to API:', patient);
      await addPatient(patient);
      alert('Patient ajouté avec succès !');
      navigate('/home');
    } catch (error) {
      console.error('Error:', error.message);
      alert('Une erreur s\'est produite lors de l\'ajout du patient. Veuillez réessayer.');
    }
  };

  return (
    <div className="mt-5 p-4">
      <h1 className="text-center text-3xl font-semibold text-gray-500 dark:text-white mb-5">Ajouter un Patient</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="relative z-0 w-full mb-5 group">
          <input
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            id="numero_identite"
            type="number"
            name="numero_identite"
            value={patient.numero_identite}
            onChange={handleChange}
            placeholder=" "
            required
          />
          <label htmlFor="numero_identite" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Numéro d'identité</label>
          {errors.numero_identite && <p className="text-red-500 text-sm">{errors.numero_identite}</p>}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            id="nom"
            type="text"
            name="nom"
            value={patient.nom}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label htmlFor="nom" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nom</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            id="prenom"
            type="text"
            name="prenom"
            value={patient.prenom}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label htmlFor="prenom" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Prénom</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            id="date_naissance"
            type="date"
            name="date_naissance"
            value={patient.date_naissance}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]} // تحديد التاريخ الأقصى كتاريخ اليوم
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label htmlFor="date_naissance" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Date de Naissance</label>
          {errors.date_naissance && <p className="text-red-500 text-sm">{errors.date_naissance}</p>}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <select
            id="sex"
            name="sex"
            value={patient.sex}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
          >
            <option value="">Sélectionnez le sexe</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <label htmlFor="sex" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Sexe</label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            id="numero_telephone"
            type="number"
            name="numero_telephone"
            value={patient.numero_telephone}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label htmlFor="numero_telephone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Numéro de téléphone</label>
          {errors.numero_telephone && <p className="text-red-500 text-sm">{errors.numero_telephone}</p>}
        </div>
        <button type="submit" className="w-full h-8 px-6 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">Ajouter</button>
      </form>
    </div>
  );
};

export default AddPatient;