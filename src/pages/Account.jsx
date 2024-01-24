import React, { useEffect, useState } from "react";
import axios from "axios";
import RecentFiles from "../components/RecentFiles";
import DepartmentFiles from "../components/DepartmentFiles";
import ErrorPage from "../components/ErrorPage";

const Account = () => {
  const [filesFromBackend, setFilesFromBackend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = JSON.parse(localStorage.getItem("token"));

        const response = await axios.get(
          "https://twokeybackend.onrender.com/file/files/Account/?recs=25",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        setFilesFromBackend(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchData();
  }, []);

  if (!localStorage.getItem("token")) {
    return <ErrorPage error="You are not authorised" />;
  }
  return (
    <div className="p-4">
      <RecentFiles />
      <DepartmentFiles filesFromBackend={filesFromBackend} />
    </div>
  );
};

export default Account;
