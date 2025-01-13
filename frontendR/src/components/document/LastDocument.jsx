// src/components/document/LastDocument.jsx
import React, { useEffect, useState } from 'react';
import { getLastDocument } from '../../services/documentService';
import { FaFileMedical } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const LastDocument = ({ patientId, categoryId }) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parsedResult, setParsedResult] = useState(null); // To store parsed JSON

  useEffect(() => {
    if (!patientId || !categoryId) {
      console.error("Invalid parameters: patientId or categoryId is missing.");
      return;
    }
  
    const fetchLastDocument = async () => {
      try {
        console.log("Fetching document with:", { patientId, categoryId });
        const data = await getLastDocument(patientId, categoryId);
        setDocument(data);
  
        if (data.decrypted_result) {
          try {
            setParsedResult(JSON.parse(data.decrypted_result));
          } catch (error) {
            setParsedResult(null);
          }
        }
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching last document:", error.response || error.message);
        setLoading(false);
      }
    };
  
    fetchLastDocument();
  }, [patientId, categoryId]);
  

  if (loading) {
    return <div className="text-center mt-4">Chargement du dernier resultat...</div>;
  }

  if (!document) {
    return <div className="text-center mt-4">Aucun resultat précédent disponible.</div>;
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-md">
      {/* Header */}
      <div className="flex items-center mb-4">
        <FaFileMedical className="text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Résultat</h3>
      </div>

      {/* Decrypted Result */}
      <div className="mb-2">
        {parsedResult ? (
          <div className="mt-1">
            {/* Display as a list */}
            <ul className="list-disc list-inside">
              {Object.entries(parsedResult).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold">{key}:</span> {value}
                </li> 
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-1">
            {/* Display as plain text */}
            <p className="bg-gray-200 dark:bg-gray-600 p-2 rounded mt-1 overflow-auto">
              {document.decrypted_result}
            </p>
          </div>
        )}
      </div>
      <div className="mb-2">
        <strong>Créé le:</strong> {new Date(document.created_at).toLocaleString()}
      </div>
    </div>
  );
};

export default LastDocument;
