import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { useDarkMode } from "../context/darkModeContext";
import RecentFiles from "./RecentFiles";
import { useAuth } from "../context/authContext";
import AddFilesInsideFolder from "./AddFilesInsideFolder";

const FilesInsideFolder = () => {
  const { formatFileSize } = useAuth();
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { darkMode } = useDarkMode();
  const { folderName, folderId } = useParams();

  useEffect(() => {
    listFilesInFolder(folderId);
  }, []);

  const listFilesInFolder = async (folder_id) => {
    let token = JSON.parse(secureLocalStorage.getItem("token"));
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/folder/listFiles/${folder_id}`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log("files", response.data);

      if (response) {
        const mappedFiles = response.data.map((file) => {
          try {
            const [{ depts }, ...extra] = file.file_info;
            const [{ name }, ...more] = depts;
            file.department = name;
          } catch (err) {
            file.department = "";
          }

          return {
            id: file.id,
            name: file.name.substring(0, 80),
            profilePic: file.profile_pic,
            size: formatFileSize(file.metadata.size),
            dept: file.department,
            owner: file.owner_email,
            mimetype: file.metadata.mimetype,
            status: "Team",
            security: "Enhanced",
            bg: file?.file_info[0]?.depts[0]?.metadata?.bg,
            lastUpdate: new Date(file.metadata.lastModified).toLocaleString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }
            ),
          };
        });

        mappedFiles.sort((a, b) => {
          return new Date(b.lastUpdate) - new Date(a.lastUpdate);
        });
        setFiles(mappedFiles);
        // console.log("test", mappedFiles);
      }
    } catch (error) {
      console.log("error occured while fetching files inside folders", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between items-center my-2">
        <h2 className="text-2xl font-semibold my-2">{folderName} :</h2>
        <AddFilesInsideFolder
          folderId={folderId}
          listFilesInFolder={listFilesInFolder}
        />
      </div>

      {/* Search bar */}
      <div className="flex justify-end items-center">
        <input
          type="text"
          placeholder="Search by file name"
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-md px-3 py-2 mb-4"
        />
      </div>

      <div>
        <RecentFiles filteredData={filteredFiles} />
      </div>
    </div>
  );
};

export default FilesInsideFolder;
