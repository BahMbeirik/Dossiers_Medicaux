/* src/components/document/CategorySelection.jsx */
import React, { useState } from 'react';
import { FaFileMedical, FaSearch } from 'react-icons/fa';

const CategorySelection = ({ categories, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
        <FaFileMedical className="mr-3 text-blue-500" />
        Sélectionnez une catégorie
      </h2>

      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 py-4">
          Aucune catégorie disponible.
        </p>
      ) : filteredCategories.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 py-4">
          Aucune catégorie correspondante trouvée.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div 
              key={category.id} 
              className="group"
            >
              <button
                className="
                  w-full flex items-center justify-between 
                  px-4 py-3 
                  bg-white dark:bg-gray-800 
                  border border-gray-200 dark:border-gray-700 
                  rounded-lg 
                  shadow-sm hover:shadow-md 
                  transition-all duration-300 
                  text-gray-700 dark:text-gray-300
                  hover:border-blue-300 dark:hover:border-blue-700
                  hover:text-blue-600 dark:hover:text-blue-400
                  group-hover:scale-105
                "
                onClick={() => onSelect(category)}
              >
                <div className="flex items-center">
                  <FaFileMedical className="mr-3 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500 group-hover:text-blue-400 transition-colors">
                  →
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelection;