import React, { useState, useEffect } from "react";
import CreateFolder from "./CreateFolder";
import OwnedFolders from "./OwnedFolders";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const DashboardFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    listFolders();
  }, []);

  const listFolders = async () => {
    setLoading(true); // Set loading to true when fetching starts

    let token = secureLocalStorage.getItem("token");

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
      console.log("error occurred while fetching folders", error);
    }

    setLoading(false); // Set loading to false after fetching completes
  };

  return (
    <div className="my-4 overflow-x-scroll scrollbar-hide">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold">Folders</h2>
        <CreateFolder listFolders={listFolders} />
      </div>
      <div className="my-2">
        {loading ? (
          <p className="text-center">Loading folders...</p>
        ) : (
          <>
            {folders.length === 0 ? (
              <p className="text-center">No folders found.</p>
            ) : (
              <OwnedFolders folders={folders} listFolders={listFolders} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardFolders;
