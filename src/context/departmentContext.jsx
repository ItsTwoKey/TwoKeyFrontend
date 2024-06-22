import React, { createContext, useState, useContext, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { auth } from "../helper/firebaseClient";
import { api } from "../utils/axios-instance";

const DepartmentContext = createContext();
export default DepartmentContext;

export function DepartmentProvider({ children }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listDepartments();
  }, [auth.currentUser]);

  const listDepartments = async () => {
    setLoading(true);
    try {
      const response = await api(`/dept/listDepts`);

      const departmentsData = response.data;
      secureLocalStorage.setItem(
        "departments",
        JSON.stringify(departmentsData)
      );
      setDepartments(departmentsData);

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <DepartmentContext.Provider
      value={{ departments, setDepartments, listDepartments, loading, error }}
    >
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartment() {
  return useContext(DepartmentContext);
}
