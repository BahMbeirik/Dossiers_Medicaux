/* src/components/document/FormikDebug.jsx */
import React from 'react';

const FormikDebug = ({ values, errors, touched }) => (
  <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-700">
    <strong>Values:</strong> {JSON.stringify(values, null, 2)}
    <br />
    <strong>Errors:</strong> {JSON.stringify(errors, null, 2)}
    <br />
    <strong>Touched:</strong> {JSON.stringify(touched, null, 2)}
  </pre>
);

export default FormikDebug;
