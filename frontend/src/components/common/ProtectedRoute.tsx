import { Navigate, useLocation } from "react-router-dom";

// Component that protects routes based on authentication status

interface ProtectedRouteProps {
    element: React.ReactNode;
    isAuthenticated: boolean;
}

export default function ProtectedRoute({ element, isAuthenticated }: ProtectedRouteProps) {
    const location = useLocation();
    return isAuthenticated ? <>{element}</> : <Navigate to="/login" replace state={{ from: location }} />;
}