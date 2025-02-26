import React, { useEffect, useState } from 'react';
import { getDocumentHistory } from '../../services/documentService';
import { FaFileMedical, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const LastDocument = ({ patientId, categoryId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId || !categoryId) {
      console.error("Invalid parameters: patientId or categoryId is missing.");
      return;
    }

    const fetchDocuments = async () => {
      try {
        const data = await getDocumentHistory(patientId, categoryId);
        setDocuments(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error.response || error.message);
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [patientId, categoryId]);

  // Function to check and format JSON results
  const formatResult = (result) => {
    try {
      const parsedResult = JSON.parse(result);
      if (typeof parsedResult === 'object' && parsedResult !== null) {
        return (
          <ul className="list-disc pl-4">
            {Object.entries(parsedResult).map(([key, value]) => (
              <li key={key}>
                <strong className="text-gray-900 dark:text-gray-200">{key}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        );
      }
    } catch (error) {
      return <p>{result}</p>; // If parsing fails, display as plain text
    }
  };

  if (loading) {
    return <div className="text-center mt-4 text-gray-600">Chargement des documents...</div>;
  }

  if (!documents.length) {
    return <div className="text-center mt-4 text-gray-600">Aucun historique disponible.</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center mb-6">
        <FaFileMedical className="text-blue-500 text-2xl mr-2" />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Historique des documents
        </h3>
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-left">
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Résultat</th>
              <th className="p-3 border-b text-center">Intégrité</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document, index) => (
              <tr 
                key={document.id} 
                className={`border-b text-gray-800 dark:text-gray-300 ${index % 2 === 0 ? "bg-gray-100 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}`}
              >
                {/* Date */}
                <td className="p-3">{new Date(document.created_at).toLocaleString()}</td>

                {/* Decrypted Result */}
                <td className="p-3">
                  <div className="p-2 bg-gray-50 dark:bg-gray-600 rounded-md overflow-auto max-w-sm">
                    {formatResult(document.decrypted_result)}
                  </div>
                </td>

                {/* Integrity Check */}
                <td className="p-3 text-center">
                  {document.is_valid ? (
                    <span className="text-green-600 dark:text-green-400 font-semibold flex items-center justify-center">
                      <FaCheckCircle className="mr-1" /> Valide
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-semibold flex items-center justify-center">
                      <FaTimesCircle className="mr-1" /> Invalide
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LastDocument;
