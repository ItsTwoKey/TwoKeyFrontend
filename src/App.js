import React from "react";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Test from "./pages/Test";
import Finance from "./pages/Finance";
import Development from "./pages/Development";
import Manufacturing from "./pages/Manufacturing";
import Sales from "./pages/Sales";
import HR from "./pages/HR";
import Background from "./components/Background";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ErrorPage from "./components/ErrorPage";
import TestDocEditor from "./pages/TestDocEditor";

const App = () => {
  const { token } = useAuth();

  const hideGrid =
    window.location.pathname === "/" ||
    window.location.pathname === "/signup" ||
    window.location.pathname === "/onboarding";
  console.log("token", token);

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
              <Route path="/account" element={<Account />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/development" element={<Development />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/manufacturing" element={<Manufacturing />} />
              <Route path="/humanresources" element={<HR />} />
              <Route path="/test" element={<Test />} />
              <Route path="/doc" element={<TestDocEditor/>} />
            </Route>
            {/* Public Routes should go below */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/" element={<Login />} exact />
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
