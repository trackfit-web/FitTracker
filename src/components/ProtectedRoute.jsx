import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const ProtectedRoute = ({ element, requiredRole }) => {
  const { userLoggedIn, loading } = useAuth();
  const userRole = localStorage.getItem("userRole");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userLoggedIn) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on the required role for the route
    return <Navigate to={userRole === "admin" ? "/admin" : "/home"} replace />;
  }

  // Render the component if authenticated and authorized
  return element;
};

export default ProtectedRoute;
