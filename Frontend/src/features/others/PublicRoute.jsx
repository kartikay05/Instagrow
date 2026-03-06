import { Navigate } from "react-router";
import { useAuth } from "../auth/hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { authenticate, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return authenticate ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;

