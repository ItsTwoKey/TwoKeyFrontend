import React, { useState, useEffect } from "react";
import CreateFolder from "./CreateFolder";
import OwnedFolders from "./OwnedFolders";

import { api } from "../utils/axios-instance";

const DashboardFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    listFolders();
  }, []);

  const listFolders = async () => {
    setLoading(true); // Set loading to true when fetching starts

    try {
      const response = await api.get(`/file/folder`);
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
