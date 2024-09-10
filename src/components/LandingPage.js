// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button'; // Import your custom Button
import { ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const navigateToAgeEstimator = () => {
    navigate('/age-estimator');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-5xl font-bold mb-6 text-center text-blue-400">
        Welcome to Age Estimator
      </h1>
      <p className="text-lg mb-8 text-center text-gray-300">
        Capture your image using the webcam to estimate your age.
      </p>
      <Button
        onClick={navigateToAgeEstimator}
        className="flex items-center justify-center py-3 px-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        <ChevronRight className="h-5 w-5 mr-2" />
        Start Estimating
      </Button>
    </div>
  );
};

export default LandingPage;
