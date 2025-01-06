export const Button = ({ children, onClick, variant = "default" }) => {
    const baseStyles = "px-4 py-2 rounded text-white";
    const variants = {
      default: "bg-blue-500 hover:bg-blue-600",
      destructive: "bg-red-500 hover:bg-red-600",
    };
  
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]}`}
      >
        {children}
      </button>
    );
  };
  