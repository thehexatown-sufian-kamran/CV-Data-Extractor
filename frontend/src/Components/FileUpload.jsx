import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('File uploaded successfully!');
        setExtractedData(data);
      } else {
        setMessage(data.message || 'Error uploading the file');
      }
    } catch (error) {
      setMessage('Error uploading file');
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-xl font-semibold mb-4 text-center">Upload Your Resume</h1>

        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="block w-full p-2 mb-4 border border-gray-300 rounded text-sm"
        />

        <button
          onClick={handleFileUpload}
          className="w-full p-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition"
        >
          Upload Resume
        </button>

        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}

        {extractedData && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Extracted Data</h2>
            <p><strong>Name:</strong> {extractedData.name}</p>
            <p><strong>Email:</strong> {extractedData.email}</p>
            <p><strong>Phone:</strong> {extractedData.phone}</p>
            <p><strong>Profession:</strong> {extractedData.profession}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
