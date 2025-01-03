/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPatient = () => {
  const [patient, setPatient] = useState({
    id: 0,
    numero_identite: '',
    nom: '',
    prenom: '',
    age: 0,
    numero_telephone: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const { id } = useParams();  // Get the patient ID from the route
  const navigate = useNavigate();  // Navigate after update

  useEffect(() => {
    // Fetch patient data by ID when the component mounts
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/auth/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,  // Ensure token exists
          },
        });
        
        setPatient(response.data);
      } catch (error) {
        setError('Error fetching patient data');
        console.error(error);
      }
    };

    fetchPatient();
  }, [id]);

  const validateFields = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'numero_identite') {
      if (value.length !== 10) {
        newErrors.numero_identite = 'Le numéro d\'identité doit contenir exactement 10 chiffres.';
      } else {
        delete newErrors.numero_identite;
      }
    }

    if (name === 'age') {
      if (value < 0) {
        newErrors.age = 'L\'âge ne peut pas être inférieur à 0.';
      } else {
        delete newErrors.age;
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
    setPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
    validateFields(name, value); 
  };

  const updatePatient = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      await axios.put(`http://localhost:8000/api/auth/patients/${patient.id}/`, patient,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      alert('Patient updated successfully');
      navigate(`/details/${patient.id}`);
    } catch (error) {
      setError('Error updating patient');
      console.error(error);
    }
  };

  return (
    <div className=" mt-5 p-4  ">
      <h1 className="text-center text-3xl font-semibold text-gray-500 dark:text-white mb-5">Modifier le Patient</h1>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={updatePatient} className="max-w-md mx-auto">
      <div className="relative z-0 w-full mb-5 group">
      <input className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            id="numero_identite" 
            type="number"
            name="numero_identite"
            value={patient.numero_identite}
            onChange={handleChange}  required />
      <label htmlFor="numero_identite"  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Numéro d'identité</label>
      {errors.numero_identite && <p className="text-red-500 text-sm">{errors.numero_identite}</p>}
      </div>
  <div className="relative z-0 w-full mb-5 group">
  <input id="nom"
  type="text"
  name="nom"
  value={patient.nom}
  onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
  <label htmlFor="nom" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nom</label>
</div>
<div className="relative z-0 w-full mb-5 group">
<input id="prenom"
type="text"
name="prenom"
value={patient.prenom}
onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
<label htmlFor="prenom" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Prénom</label>
</div>
<div className="relative z-0 w-full mb-5 group">
<input id="age"
type="number"
name="age"
value={patient.age}
onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
<label htmlFor="age" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Âge</label>
{errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
</div>
<div className="relative z-0 w-full mb-5 group">
<input id="numero_telephone"
type="number"
name="numero_telephone"
value={patient.numero_telephone}
onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
<label htmlFor="numero_telephone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Numéro de téléphone</label>
{errors.numero_telephone && <p className="text-red-500 text-sm">{errors.numero_telephone}</p>}
</div>
        
        <button type="submit" className="w-full h-8 px-6 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default EditPatient;
