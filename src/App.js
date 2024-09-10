// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AgeEstimator from './components/AgeEstimator';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/age-estimator" element={<AgeEstimator />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
