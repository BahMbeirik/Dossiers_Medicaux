import React, { useEffect, useState } from "react";
import { FaUserMd, FaHospitalSymbol, FaSpinner } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { getHospitalStats } from "../../services/AdminDashboard";

const HospitalStats = ({ data }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("name"); // "name" or "doctors"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  useEffect(() => {
    // Use provided data if available, otherwise fetch via service
    if (data) {
      setHospitals(data);
      setLoading(false);
      return;
    }
    setLoading(true);
    getHospitalStats()
      .then((responseData) => {
        setHospitals(responseData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hospitals:", err);
        setError("Impossible de charger les données des hôpitaux");
        setLoading(false);
      });
  }, [data]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortedHospitals = [...hospitals].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === "asc"
        ? a.num_doctors - b.num_doctors
        : b.num_doctors - a.num_doctors;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <FaSpinner className="animate-spin text-blue-500 text-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort controls */}
      <div className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <h3 className="text-gray-700 dark:text-gray-300 font-medium">
          {hospitals.length} hôpitaux au total
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleSort("name")}
            className={`px-3 py-1 rounded text-sm flex items-center ${
              sortBy === "name"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Nom
            {sortBy === "name" &&
              (sortOrder === "asc" ? (
                <FaArrowTrendUp className="ml-1" />
              ) : (
                <FaArrowTrendDown className="ml-1" />
              ))}
          </button>
          <button
            onClick={() => handleSort("doctors")}
            className={`px-3 py-1 rounded text-sm flex items-center ${
              sortBy === "doctors"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Médecins
            {sortBy === "doctors" &&
              (sortOrder === "asc" ? (
                <FaArrowTrendUp className="ml-1" />
              ) : (
                <FaArrowTrendDown className="ml-1" />
              ))}
          </button>
        </div>
      </div>

      {/* Hospital cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedHospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <FaHospitalSymbol className="mr-2 text-blue-500" />
                {hospital.name}
              </h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaUserMd className="mr-2 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-300">Médecins</span>
                </div>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {hospital.num_doctors}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>

      {hospitals.length === 0 && (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Aucun hôpital trouvé</p>
        </div>
      )}
    </div>
  );
};

export default HospitalStats;
