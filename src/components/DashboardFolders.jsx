import React, { useState, useEffect } from "react";
import CreateFolder from "./CreateFolder";
import OwnedFolders from "./OwnedFolders";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const DashboardFolders = () => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    listfolders();
  }, []);

  const listfolders = async () => {
    let token = JSON.parse(secureLocalStorage.getItem("token"));

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/folder`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log("folders", response.data);
      setFolders(response.data);
    } catch (error) {
      console.log("error occured while fetching folders", error);
    }
  };

  return (
    <div className="my-4">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold">Folders</h2>
        <CreateFolder />
      </div>
      <OwnedFolders folders={folders} />
    </div>
  );
};

export default DashboardFolders;
