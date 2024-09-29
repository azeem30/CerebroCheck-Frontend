import React, { useState } from 'react';
import '../styles/home.css';

function Home() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageSelection = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(URL.createObjectURL(file));
            setImageFile(file);
            setError(null); 
        }
    };

    const handleUpload = async () => {
      if (imageFile) {
          const formData = new FormData();
          formData.append('file', imageFile);
  
          try {
              setLoading(true);
              console.log('Uploading image...');  
              const response = await fetch('https://cerebrocheck-backend.onrender.com/classify', {
                  method: 'POST',
                  body: formData,
              });
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              const data = await response.json(); 
              console.log('Upload successful:', data); 
              setResult(data);
          } catch (error) {
              console.error('Error uploading image:', error);
              setError('Error uploading image. Please try again.');
          } finally {
              setLoading(false);
          }
      }
  };

    const handleClear = () => {
        setSelectedImage(null);
        setImageFile(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="container-fluid d-flex flex-column justify-content-center align-items-center">
            {!selectedImage && (
                <p className="upload-message mb-4">
                    Please upload an MRI scan of the Brain
                </p>
            )}
            <div className="card">
                <div className="card-body text-center">
                    {!selectedImage ? (
                        <label htmlFor="upload" className="upload-placeholder">
                            <div className="upload-icon d-flex justify-content-center align-items-center mx-auto">
                                <span className="display-4 text-primary">+</span>
                            </div>
                            <input
                                id="upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelection}
                                style={{ display: 'none' }}
                                aria-label="Upload Image"
                            />
                        </label>
                    ) : (
                        <div className="uploaded-image-container">
                            <img
                                src={selectedImage}
                                alt="Uploaded"
                                className="img-thumbnail mb-3"
                            />
                            <button className="btn btn-primary mt-3" onClick={handleClear}>
                                Clear
                            </button>
                        </div>
                    )}
                    {selectedImage && (
                        <button
                            className="btn btn-primary mt-3 mb-3"
                            onClick={handleUpload}
                            disabled={!selectedImage || loading}
                        >
                            Upload
                        </button>
                    )}
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-danger">{error}</p>}
                    {result && (
                        <div className="mt-4">
                            <h4>Classification Result:</h4>
                            <p>Result: {result.result}</p>
                            <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
