/* src/components/patient/Home.jsx */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatients } from "../../services/patientService";
import { toast } from "react-hot-toast";
import { FaUserPlus, FaUserCircle } from "react-icons/fa";

const Home = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error.message);
      toast.error("Erreur lors de la récupération des patients.");
    }
  };

  const navigateToDetails = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center pb-4">
        <h3 className="text-xl font-bold flex items-center">
          <FaUserCircle className="mr-2 text-blue-500" />
          Patients
        </h3>
        <button
          onClick={() => navigate("/add")}
          className="flex items-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <FaUserPlus className="mr-2" />
          Ajouter un Patient
        </button>
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        {patients.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Aucun patient trouvé.</p>
        ) : (
          patients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white dark:bg-gray-700 border-l-4 border-blue-500 rounded-r-lg shadow-sm w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => navigateToDetails(patient.id)}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <FaUserCircle className="mr-2 text-blue-500" />
                {patient.nom} {patient.prenom}
              </h3>
              <p className="text-gray-400">NNI : {patient.numero_identite}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
