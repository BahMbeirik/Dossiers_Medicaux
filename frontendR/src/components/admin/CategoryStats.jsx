import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaSpinner, FaChartPie, FaListUl } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { getCategoryStats } from "../../services/AdminDashboard";

const COLORS = [
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
  "#F97316"  // orange-500
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 shadow-md rounded border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-800 dark:text-gray-200">{payload[0].name}</p>
        <p className="text-blue-600 dark:text-blue-400">
          <span className="font-bold">{payload[0].value}</span> documents
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          {payload[0].payload.percentage}% du total
        </p>
      </div>
    );
  }
  return null;
};

const CategoryStats = ({ data }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("chart"); // "chart" or "list"

  useEffect(() => {
    // Use provided data if available; otherwise, fetch via service
    if (data) {
      processData(data);
      return;
    }
    setLoading(true);
    getCategoryStats()
      .then((responseData) => {
        processData(responseData);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Impossible de charger les données des catégories");
        setLoading(false);
      });
  }, [data]);

  const processData = (rawData) => {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      setCategories([]);
      setLoading(false);
      return;
    }
    // Calculate total documents for percentages
    const total = rawData.reduce((sum, category) => sum + category.num_documents, 0);
    // Process and sort data (descending by document count)
    const processedData = rawData
      .map((category) => ({
        ...category,
        percentage: Math.round((category.num_documents / total) * 100),
      }))
      .sort((a, b) => b.num_documents - a.num_documents);
    setCategories(processedData);
    setLoading(false);
  };

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

  if (categories.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Aucune catégorie trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View controls */}
      <div className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <h3 className="text-gray-700 dark:text-gray-300 font-medium">
          {categories.length} catégories au total
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("chart")}
            className={`px-3 py-1 rounded text-sm flex items-center ${
              viewMode === "chart"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <FaChartPie className="mr-1" /> Graphique
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 rounded text-sm flex items-center ${
              viewMode === "list"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <FaListUl className="mr-1" /> Liste
          </button>
        </div>
      </div>

      {viewMode === "chart" ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="num_documents"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                labelLine={false}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {categories.map((category, index) => (
            <div
              key={category.id || index}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div className="flex items-center">
                  <BiSolidCategoryAlt className="mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-800 dark:text-gray-200">{category.name}</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 dark:text-blue-400 font-medium mr-2">
                  {category.num_documents}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {category.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryStats;
