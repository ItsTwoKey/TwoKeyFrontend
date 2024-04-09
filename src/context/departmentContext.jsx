import React, { createContext, useState, useContext, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const DepartmentContext = createContext();
export default DepartmentContext;

export function DepartmentProvider({ children }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listDepartments();
  }, []);

  const listDepartments = async () => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));
      let cachedDepartments = JSON.parse(
        secureLocalStorage.getItem("departments")
      );

      //   if (cachedDepartments) {
      //     setDepartments(cachedDepartments);
      //     setLoading(false);
      //   } else {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/dept/listDepts`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      const departmentsData = response.data;
      secureLocalStorage.setItem(
        "departments",
        JSON.stringify(departmentsData)
      );
      setDepartments(departmentsData);
      setLoading(false);
      //   }
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
