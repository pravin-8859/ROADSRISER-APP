import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const mechanic = localStorage.getItem("mechanic");

  return mechanic ? children : <Navigate to="/auth/mechanic/login" />;
};

export default ProtectedRoute;