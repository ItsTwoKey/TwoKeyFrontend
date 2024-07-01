import React, { useState, useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "./Loading";
import secureLocalStorage from "react-secure-storage";
import { auth } from "../helper/firebaseClient";

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
  const data = secureLocalStorage.getItem("profileData");
  const userDetails = useMemo(() => {
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error("Could not parse profile data", { err });
      return null;
    }
  }, [data]);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log({ user });
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (
    userDetails &&
    userDetails?.is_authenticated &&
    !userDetails?.is_approved
  ) {
    console.log("User not approved, redirecting to waiting lobby");
    return <Navigate to="/waiting-lobby" />;
  }

  console.log({ isAuthenticated });
  if (!isAuthenticated) {
    console.log("Redirecting to login page", isAuthenticated, isLoading);
    return (
      <Navigate to={"/login"} replace state={{ path: location.pathname }} />
    );
  }
  return <Outlet />;
}
