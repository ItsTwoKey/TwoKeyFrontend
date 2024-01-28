import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "./Loading";
import  secureLocalStorage  from  "react-secure-storage";

/**
 * ProtectedRoute is a component that enforces access control for routes.
 *
 * If a user is authenticated (has a valid token), the component renders the route content.
 * If the user is not authenticated, they are redirected to the login page.
 *
 * @returns {JSX.Element} The rendered JSX element, either the route content or a redirection to the login/home page.
 */
export function ProtectedRoute() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const sessionToken = secureLocalStorage.getItem("token");
    if (sessionToken) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (!isAuthenticated) {
    return <Navigate to={"/"} replace state={{ path: location.pathname }} />;
  }
  return <Outlet />;
}
