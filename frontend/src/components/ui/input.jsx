export const Input = ({ value, onChange, placeholder, type = "text", className }) => (
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className={`border rounded px-2 py-1 w-full ${className}`}
    />
  );
  