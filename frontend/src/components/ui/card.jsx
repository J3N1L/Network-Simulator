export const Card = ({ children, className }) => (
    <div className={`border rounded-lg shadow p-4 ${className}`}>{children}</div>
  );
  
  export const CardHeader = ({ children }) => (
    <div className="mb-4">{children}</div>
  );
  
  export const CardTitle = ({ children }) => (
    <h2 className="text-xl font-bold">{children}</h2>
  );
  
  export const CardContent = ({ children }) => (
    <div>{children}</div>
  );
  