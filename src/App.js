import React, { useEffect } from "react";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import Test from "./pages/Test";
import Finance from "./pages/Finance";
import Development from "./pages/Development";
import Manufacturing from "./pages/Manufacturing";
import Sales from "./pages/Sales";
import HR from "./pages/HR";
import Background from "./components/Background";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ErrorPage from "./components/ErrorPage";

const REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

const App = () => {
  const { token, refreshAccessToken } = useAuth();
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshAccessToken();
    }, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [refreshAccessToken]);

  return (
    <Router>
      <div className="flex">
        <SideBar />
        <div className="w-full">
          <TopBar />

          <Background />
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/user-profile/:userId" element={<UserProfile />} />
              <Route path="/account" element={<Account />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/development" element={<Development />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/manufacturing" element={<Manufacturing />} />
              <Route path="/humanresources" element={<HR />} />
              <Route path="/settings" element={<Settings />} />

              <Route path="/test" element={<Test />} />
            </Route>
            {/* Public Routes should go below */}

            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} exact />
            <Route
              path="/*"
              element={
                <ErrorPage error={"We could not find the requested page."} />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
