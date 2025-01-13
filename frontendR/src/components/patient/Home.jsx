/* eslint-disable no-unused-vars */
/* src/components/patient/Home.jsx */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPatients } from "../../services/patientService";
import { toast } from "react-hot-toast";
import { FaUserPlus, FaUserCircle } from "react-icons/fa";

const PAGE_SIZE = 2; // Show 10 patients per page

const Home = () => {
  const [allPatients, setAllPatients] = useState([]);      // Full dataset from backend
  const [filteredPatients, setFilteredPatients] = useState([]); // After global search
  const [currentPage, setCurrentPage] = useState(1);       // Which page are we on (1-based)
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // 1. Fetch all patients once
  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    try {
      const data = await getAllPatients(); // returns an array of patients
      setAllPatients(data);
      setFilteredPatients(data); // by default, show them all
    } catch (error) {
      console.error("Error fetching patients:", error.message);
      toast.error("Erreur lors de la récupération des patients.");
    }
  };

  // 2. Handle global (case-insensitive) search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    if (!value) {
      // if the search is empty, show all again
      setFilteredPatients(allPatients);
      setCurrentPage(1); // reset to page 1
    } else {
      const filtered = allPatients.filter((patient) =>
        patient.nom.toLowerCase().includes(value) ||
        patient.prenom.toLowerCase().includes(value) ||
        patient.numero_identite.toLowerCase().includes(value)
      );
      setFilteredPatients(filtered);
      setCurrentPage(1); // reset to page 1 for new search
    }
  };

  // 3. Derived array of patients just for the current page
  const totalFiltered = filteredPatients.length;
  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPagePatients = filteredPatients.slice(startIndex, endIndex);

  // 4. Pagination controls
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const navigateToDetails = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center pb-12">
        <h3 className="text-xl font-bold flex items-center">
          <FaUserCircle className="mr-2 text-blue-500" />
          Patients
        </h3>

        {/* Search bar for global search */}
        <div className="w-2/5">
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <button
          onClick={() => navigate("/add")}
          className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <FaUserPlus className="mr-2" />
          Ajouter un Patient
        </button>
      </div>

      {/* Patients Grid */}
      <div className="flex flex-wrap gap-4 p-4">
        {currentPagePatients.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            Aucun patient trouvé.
          </p>
        ) : (
          currentPagePatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white dark:bg-gray-700 border-l-4 border-blue-500 rounded-r-lg shadow-sm w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => navigateToDetails(patient.id)}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <FaUserCircle className="mr-2 text-blue-500" />
                {patient.nom} {patient.prenom}
              </h3>
              <p className="text-gray-400">
                NNI : {patient.numero_identite}
              </p>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex flex-col items-center mt-4 gap-2">
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
        {/* Page number under the pagination button */}
        <p className="text-gray-600 dark:text-gray-400">
          Page {currentPage} sur {totalPages}
        </p>
      </div>
    </div>
  );
};

export default Home;
