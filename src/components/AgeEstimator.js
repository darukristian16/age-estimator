// src/components/AgeEstimator.js
import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import Button from './Button';
import Card from './Card';
import { Camera } from 'lucide-react'; // Import an icon

const AgeEstimator = () => {
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      handleImageUpload(imageSrc);
    }
  }, [webcamRef]);

  const handleImageUpload = async (imageSrc) => {
    setLoading(true);
    setError(null);

    try {
      const blob = await fetch(imageSrc).then(res => res.blob());
      const formData = new FormData();
      formData.append('file', blob, 'webcam_capture.jpg');

      const response = await axios.post(
        'https://telkom-ai-dag.api.apilogy.id/Age_Estimator_GPU/0.0.1/v1',
        formData,
        {
          headers: {
            'x-api-key': 'adDwfx485WAOwGeaiVcRu4at5nyFvHp4',
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('API Response:', response.data); // Debug API response

      if (response.data && response.data.data && response.data.data.length > 0) {
        const personData = response.data.data.find(item => item.name === "person");
        if (personData) {
          setAge(personData.age);
          setGender(personData.gender);
        } else {
          setError('Person not detected');
        }
      } else {
        setError('No data found in the API response');
      }

    } catch (err) {
      console.error('API Error:', err); // Debug API error
      setError(`Error: ${err.response ? err.response.data : err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8 p-6 max-w-md mx-auto bg-gray-800 text-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Age Estimator Using Webcam</h1>

      <div className="mb-6 flex justify-center">
        <Webcam
          audio={false}
          height={480}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          videoConstraints={videoConstraints}
          className="rounded-lg border-2 border-gray-700"
        />
      </div>

      <Button 
        onClick={capture} 
        className="w-full flex items-center justify-center space-x-2 mb-4"
      >
        <Camera className="h-5 w-5" />
        <span>Capture & Estimate Age</span>
      </Button>

      {loading && (
        <p className="my-4 text-center text-gray-400">Loading...</p>
      )}

      {age !== null && (
        <div className="my-4 text-center">
          <p className="text-xl font-semibold">
            <strong>Estimated Age:</strong> {age}
          </p>
          <p className="text-xl font-semibold">
            <strong>Gender:</strong> {gender}
          </p>
        </div>
      )}

      {error && (
        <p className="text-red-400 my-4 text-center">{error}</p>
      )}
    </Card>
  );
};

export default AgeEstimator;
