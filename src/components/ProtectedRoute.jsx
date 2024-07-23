import React, { useState, useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "./Loading";
import secureLocalStorage from "react-secure-storage";
import { auth } from "../helper/firebaseClient";
import { useAuth } from "../context/authContext";

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
  // const [isApproved, setIsApproved] = useState(false);
  // const [hasOnBoarded, setHasOnBoarded] = useState(false);
  const { profileData, profileIsPending, setProfileIsPending } = useAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log({ user });
      if (user) {
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
      setProfileIsPending(false);
    });

    return () => unsubscribe();
  }, []);

  console.log({
    profileData,
    profileIsPending,
    // hasOnBoarded,
    // isApproved,
    // isAuthenticated,
  });

  if (profileIsPending) {
    return <Loading />;
  }
  if (!profileData?.is_authenticated) {
    console.log("Redirecting to login page");
    return (
      <Navigate to={"/login"} replace state={{ path: location.pathname }} />
    );
  }

  if (!profileData?.username && location.pathname !== "/onboard") {
    console.log("on");
    return (
      <Navigate to={"/onboard"} replace state={{ path: location.pathname }} />
    );
  }

  if (profileData?.username && location.pathname === "/onboard") {
    return (
      <Navigate
        to={"/waiting-lobby"}
        replace
        state={{ path: location.pathname }}
      />
    );
  }

  if (
    !profileData?.is_approved &&
    location.pathname !== "/onboard" &&
    location.pathname !== "/waiting-lobby"
  ) {
    console.log("User not approved, redirecting to waiting lobby");
    return (
      <Navigate
        to="/waiting-lobby"
        replace
        state={{ path: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
