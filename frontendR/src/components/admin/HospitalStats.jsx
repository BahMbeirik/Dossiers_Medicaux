/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowsDownToPeople } from "react-icons/fa6";
import { FaUserPlus, FaHospitalSymbol } from "react-icons/fa";

const HospitalStats = () => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token"); 
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.get("http://localhost:8000/api/hospitals/stats/")
        .then(response => setHospitals(response.data))
        .catch(error => console.error("Error fetching hospitals:", error));
    } else {
      console.error("No token found");
    }
  }, []);

  return (
    <div className="flex flex-wrap justify-between items-center pb-12 ">
        {hospitals.map(hospital => (
          <div key={hospital.id} className="bg-gray-50  mb-6 dark:bg-gray-700 border-l-4 border-blue-500 rounded-r-lg shadow-sm flex flex-wrap p-4 cursor-pointer hover:shadow-md transition-shadow duration-200 ">
                  <div className="w-full">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <FaHospitalSymbol className="mr-2 text-blue-500" />
                    {hospital.name}
                  </h3>
                  <p className="text-gray-400 flex items-center">
                  <FaArrowsDownToPeople className="mr-2 text-blue-500" />
                  {hospital.num_doctors} médecins
                  </p>
                  </div>
                </div>
      ))}
    
    </div>
  );
};

export default HospitalStats;
