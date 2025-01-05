/* src/components/patient/EditPatient.jsx */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientDetails, updatePatient } from "../../services/patientService";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const EditPatient = () => {
  const { id } = useParams(); // Patient ID from route
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
        await updatePatient(id, values);
        toast.success('Patient mis à jour avec succès !');
        navigate(`/details/${id}`);
      } catch (error) {
        console.error('Error:', error.message);
        toast.error("Une erreur s'est produite lors de la mise à jour du patient. Veuillez réessayer.");
      }
    },
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatientDetails(id);
        formik.setValues({
          numero_identite: data.numero_identite,
          nom: data.nom,
          prenom: data.prenom,
          date_naissance: data.date_naissance,
          sex: data.sex,
          numero_telephone: data.numero_telephone,
        });
      } catch (error) {
        toast.error("Erreur lors de la récupération des données du patient.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Chargement des données du patient...</div>;
  }

  return (
    <div className="mt-5 p-4">
      <h1 className="text-center text-3xl font-semibold text-gray-500 dark:text-white mb-5 flex items-center justify-center">
        <FaEdit className="mr-2" />
        Modifier le Patient
      </h1>

      <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto">
        {/* Numéro d'identité */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="numero_identite"
            id="numero_identite"
            value={formik.values.numero_identite}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white ${
              formik.touched.numero_identite && formik.errors.numero_identite ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
          />
          <label
            htmlFor="numero_identite"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Numéro d'identité
          </label>
          {formik.touched.numero_identite && formik.errors.numero_identite && (
            <p className="text-red-500 text-sm">{formik.errors.numero_identite}</p>
          )}
        </div>

        {/* Nom */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="nom"
            id="nom"
            value={formik.values.nom}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white ${
              formik.touched.nom && formik.errors.nom ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
          />
          <label
            htmlFor="nom"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Nom
          </label>
          {formik.touched.nom && formik.errors.nom && (
            <p className="text-red-500 text-sm">{formik.errors.nom}</p>
          )}
        </div>

        {/* Prénom */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="prenom"
            id="prenom"
            value={formik.values.prenom}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white ${
              formik.touched.prenom && formik.errors.prenom ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
          />
          <label
            htmlFor="prenom"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Prénom
          </label>
          {formik.touched.prenom && formik.errors.prenom && (
            <p className="text-red-500 text-sm">{formik.errors.prenom}</p>
          )}
        </div>

        {/* Date de naissance */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="date"
            name="date_naissance"
            id="date_naissance"
            value={formik.values.date_naissance}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            max={new Date().toISOString().split('T')[0]} // Prevent selecting future dates
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white ${
              formik.touched.date_naissance && formik.errors.date_naissance ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
          />
          <label
            htmlFor="date_naissance"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Date de naissance
          </label>
          {formik.touched.date_naissance && formik.errors.date_naissance && (
            <p className="text-red-500 text-sm">{formik.errors.date_naissance}</p>
          )}
        </div>

        {/* Sexe */}
        <div className="relative z-0 w-full mb-5 group">
          <select
            name="sex"
            id="sex"
            value={formik.values.sex}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white ${
              formik.touched.sex && formik.errors.sex ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
          >
            <option value="" disabled>-- Sexe --</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
          <label
            htmlFor="sex"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Sexe
          </label>
          {formik.touched.sex && formik.errors.sex && (
            <p className="text-red-500 text-sm">{formik.errors.sex}</p>
          )}
        </div>

        {/* Numéro de téléphone */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="numero_telephone"
            id="numero_telephone"
            value={formik.values.numero_telephone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white ${
              formik.touched.numero_telephone && formik.errors.numero_telephone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
            placeholder=" "
          />
          <label
            htmlFor="numero_telephone"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
          >
            Numéro de téléphone
          </label>
          {formik.touched.numero_telephone && formik.errors.numero_telephone && (
            <p className="text-red-500 text-sm">{formik.errors.numero_telephone}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full h-10 px-6 text-white transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800 flex items-center justify-center ${
            formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Mise à jour en cours...' : (
            <>
              <FaEdit className="mr-2" />
              Mettre à jour
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EditPatient;
