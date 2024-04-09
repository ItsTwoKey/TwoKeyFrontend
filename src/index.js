import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { DarkModeProvider } from "./context/darkModeContext";
import { AuthProvider } from "./context/authContext";
import { DepartmentProvider } from "./context/departmentContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <DarkModeProvider>
      <DepartmentProvider>
        <App />
      </DepartmentProvider>
    </DarkModeProvider>
  </AuthProvider>
);
