// src/components/Card.js
import React from 'react';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      {...props}
      className={`bg-gray-800 rounded-lg shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
