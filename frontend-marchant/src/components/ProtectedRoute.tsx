import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";
import Login from "./Login";
import SplashScreen from "./SplashScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = authService.checkAuthStatus();
      setIsAuthenticated(authStatus);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true); // Force a re-check of auth status to ensure consistency
    setTimeout(() => {
      const authStatus = authService.checkAuthStatus();
      setIsAuthenticated(authStatus);
    }, 100);
  };

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return <SplashScreen message="Checking authentication..." />;
  }

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // If authenticated, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
