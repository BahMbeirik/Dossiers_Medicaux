import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPatients } from "../../services/patientService";
import { toast } from "react-hot-toast";
import { 
  FaUserPlus, 
  FaUserCircle, 
  FaSearch, 
  FaChevronLeft, 
  FaChevronRight 
} from "react-icons/fa";
import { MdFilterList } from "react-icons/md";

const PAGE_SIZE = 10;

const Home = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortField, setSortField] = useState("nom");
  const [sortDirection, setSortDirection] = useState("asc");

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPatients();
      setAllPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error.message);
      toast.error("Erreur lors de la récupération des patients.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value) {
      setFilteredPatients(allPatients);
    } else {
      const filtered = allPatients.filter((patient) =>
        patient.nom.toLowerCase().includes(value) ||
        patient.prenom.toLowerCase().includes(value) ||
        patient.numero_identite.toLowerCase().includes(value)
      );
      setFilteredPatients(filtered);
    }
    setCurrentPage(1);
  };

  // Sort patients
  const handleSort = (field) => {
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);

    const sorted = [...filteredPatients].sort((a, b) => {
      if (a[field] < b[field]) return newDirection === "asc" ? -1 : 1;
      if (a[field] > b[field]) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredPatients(sorted);
  };

  // Calculate pagination info
  const totalFiltered = filteredPatients.length;
  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPagePatients = filteredPatients.slice(startIndex, endIndex);

  // Pagination controls
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

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const navigateToDetails = (id) => {
    navigate(`/details/${id}`);
  };

  // Render page numbers for pagination
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i}>
          <button
            onClick={() => setCurrentPage(i)}
            className={`w-8 h-8 flex items-center justify-center rounded 
              text-sm border border-blue-300
              ${
                currentPage === i
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
          >
            {i}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        {/* Dashboard Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Consolidated Controls Bar */}
          <div className="bg-gray-50 rounded-lg p-3 mt-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* View Options and Sort */}
              <div className="flex items-center space-x-2 w-full lg:w-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 
                      0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 
                      012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 
                      2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 
                      012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 
                      16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 
                      01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div className="flex items-center">
                  <MdFilterList className="text-gray-500 mr-1" />
                  <select
                    className="p-2 bg-gray-100 rounded border-none focus:ring-2 focus:ring-blue-400 text-sm"
                    onChange={(e) => handleSort(e.target.value)}
                    value={sortField}
                  >
                    <option value="nom">Trier par Nom</option>
                    <option value="prenom">Trier par Prénom</option>
                    <option value="numero_identite">Trier par NNI</option>
                  </select>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-2/5">
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom ou NNI..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="p-2 pl-10 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Add Patient Button */}
              <button
                onClick={() => navigate("/add")}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm w-full lg:w-auto justify-center"
              >
                <FaUserPlus className="mr-2" />
                Ajouter un Patient
              </button>
            </div>

            {/* Display Count Info */}
            <div className="text-sm text-gray-600 mt-3">
              {isLoading ? (
                "Chargement des patients..."
              ) : (
                <>
                  Affichage de {Math.min(totalFiltered, 1 + startIndex)}-
                  {Math.min(totalFiltered, endIndex)} sur {totalFiltered} patients
                  {searchTerm && ` (recherche: "${searchTerm}")`}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Patients Display */}
            {currentPagePatients.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-16 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 
                    10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-500 text-lg">Aucun patient trouvé.</p>
                <p className="text-gray-400 mt-2">
                  Essayez de modifier votre recherche ou d'ajouter un nouveau
                  patient.
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentPagePatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => navigateToDetails(patient.id)}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer border-l-4 border-blue-500"
                  >
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FaUserCircle className="mr-2 text-blue-500" />
                        {patient.nom} {patient.prenom}
                      </h3>
                      <p className="text-gray-500 mt-1 flex items-center">
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                          NNI: {patient.numero_identite}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("nom")}
                      >
                        <div className="flex items-center">
                          Nom
                          {sortField === "nom" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("prenom")}
                      >
                        <div className="flex items-center">
                          Prénom
                          {sortField === "prenom" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("numero_identite")}
                      >
                        <div className="flex items-center">
                          NNI
                          {sortField === "numero_identite" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPagePatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigateToDetails(patient.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.nom}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {patient.prenom}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {patient.numero_identite}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToDetails(patient.id);
                            }}
                          >
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between">
              {/* Côté gauche : Boutons de pagination */}
              <ul className="flex items-center space-x-2 mb-2 sm:mb-0">
                <li>
                  <button
                    onClick={handleFirstPage}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 text-sm rounded border border-blue-300 text-blue-600 disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed hover:bg-blue-50"
                  >
                    Premier
                  </button>
                </li>
                <li>
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    className="p-2 rounded border border-blue-300 text-blue-600 disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed hover:bg-blue-50"
                  >
                    <FaChevronLeft />
                  </button>
                </li>

                {renderPageNumbers()}

                <li>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    className="p-2 rounded border border-blue-300 text-blue-600 disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed hover:bg-blue-50"
                  >
                    <FaChevronRight />
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLastPage}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-sm rounded border border-blue-300 text-blue-600 disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed hover:bg-blue-50"
                  >
                    Dernier
                  </button>
                </li>
              </ul>

              {/* Côté droit : Informations de la page */}
              <div className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </div>
            </div>
          )}

          </>
        )}
      </div>
    </div>
  );
};

export default Home;
