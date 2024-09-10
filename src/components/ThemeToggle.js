import React from 'react';

const ThemeToggle = () => {
  const toggleTheme = () => {
    document.body.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 dark:bg-gray-800 dark:text-gray-200"
    >
      Toggle Theme
    </button>
  );
};

export default ThemeToggle;
