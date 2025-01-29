/* eslint-disable no-unused-vars */
/* src/components/document/DocumentDetails.jsx */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { verifyDocumentIntegrity } from "../../services/documentService";
import { toast } from 'react-hot-toast';

const DocumentDetails = () => {
  const { patientId } = useParams();
  const [document, setDocument] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Fetch document details here if needed
  }, [patientId]);

  const handleVerifyIntegrity = async () => {
    setIsVerifying(true);
    try {
      const response = await verifyDocumentIntegrity(document.id);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors de la vérification.");
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!document) {
    return <div className="text-center text-gray-700 dark:text-gray-300">Chargement du document...</div>;
  }

  return (
    <div className="container mx-auto m-5 p-6 rounded-lg shadow-lg bg-white  max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Détails du Document</h1>
      <div className="mb-4">
        <strong>ID:</strong> {document.id}
      </div>
      <div className="mb-4">
        <strong>Patient ID:</strong> {document.patient}
      </div>
      <div className="mb-4">
        <strong>Category ID:</strong> {document.category}
      </div>
      <div className="mb-4">
        <strong>Doctor ID:</strong> {document.doctor}
      </div>
      <div className="mb-4">
        <strong>Result:</strong> {document.result}
      </div>
      <div className="mb-4">
        <strong>Hash:</strong> {document.hash}
      </div>
      <div className="mb-4">
        <strong>Created At:</strong> {new Date(document.created_at).toLocaleString()}
      </div>
      <button
        onClick={handleVerifyIntegrity}
        className={`px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
          isVerifying ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isVerifying}
      >
        {isVerifying ? 'Vérification en cours...' : 'Vérifier l\'intégrité'}
      </button>
    </div>
  );
};

export default DocumentDetails;
