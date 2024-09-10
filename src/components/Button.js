// src/components/Button.js
const Button = ({ onClick, children, className }) => {
    return (
      <button
        onClick={onClick}
        className={`py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  