import { Navigate } from "react-router";
import { useAuth } from "../auth/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { authenticate, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return authenticate ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
