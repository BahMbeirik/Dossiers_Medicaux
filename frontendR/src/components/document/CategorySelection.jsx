/* src/components/document/CategorySelection.jsx */
import React from 'react';
import { FaFileMedical } from 'react-icons/fa';

const CategorySelection = ({ categories, onSelect }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Sélectionnez une catégorie:</h2>
    {categories.length === 0 ? (
      <p className="text-gray-600 dark:text-gray-400">Aucune catégorie disponible.</p>
    ) : (
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              className="w-full flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-600 transition-colors"
              onClick={() => onSelect(category)}
            >
              <FaFileMedical className="mr-2" />
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default CategorySelection;
