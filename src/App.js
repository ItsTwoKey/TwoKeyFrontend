import React, { useEffect, useState } from "react";
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
import AI from "./pages/AI";
import Analytics from "./pages/Analytics";
import ContactUs from "./pages/ContactUs";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
// import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ErrorPage from "./components/ErrorPage";
import { useDarkMode } from "./context/darkModeContext";

let hardCodedDepartments = [
  { name: "Account", metadata: { bg: "#FFF6F6", border: "#FEB7B7" } },
  { name: "Finance", metadata: { bg: "#FFF6FF", border: "#FFA9FF" } },
  { name: "Development", metadata: { bg: "#F6FFF6", border: "#B3FFB3" } },
  { name: "Manufacturing", metadata: { bg: "#F6F7FF", border: "#B6BEFF" } },
  { name: "Sales", metadata: { bg: "#FFFFF6", border: "#FFFFA1" } },
  { name: "Human Resources", metadata: { bg: "#F6FFFE", border: "#C0FFF8" } },
];

const REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

let fetchedDepartments = JSON.parse(secureLocalStorage.getItem("departments"));

const App = () => {
  const { token, refreshAccessToken } = useAuth();
  const isDarkMode = useDarkMode();
  const [departments, setDepartments] = useState(hardCodedDepartments);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshAccessToken();
    }, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [refreshAccessToken]);

  useEffect(() => {
    const fetchedDepartments = JSON.parse(
      secureLocalStorage.getItem("departments")
    );
    if (fetchedDepartments) {
      setDepartments(fetchedDepartments);
    }
  }, []);
  return (
    <Router>
      <div className="md:flex ">
        <SideBar departments={departments} />
        <div className="w-full">
          <TopBar />

          <Background />
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/user-profile/:userId" element={<UserProfile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/department/Account" element={<Account />} />
              <Route path="/department/Finance" element={<Finance />} />
              <Route path="/department/Development" element={<Development />} />
              <Route path="/department/Sales" element={<Sales />} />
              <Route path="/department/Marketing" element={<Manufacturing />} />
              <Route path="/department/Human_Resource" element={<HR />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/ai/:fileId" element={<AI />} />

              <Route path="/test" element={<Test />} />
            </Route>
            {/* Public Routes should go below */}

            <Route path="/" element={<Home />} />
            <Route path="/contact-us" element={<ContactUs />} />
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
