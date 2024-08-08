import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { useDarkMode } from "../context/darkModeContext";
import RecentFiles from "./RecentFiles";
import { useAuth } from "../context/authContext";
import AddFilesInsideFolder from "./AddFilesInsideFolder";
import { auth } from "../helper/firebaseClient";
import { useDepartment } from "../context/departmentContext";
import { api } from "../utils/axios-instance";
import MultipleFileMenu from "./MultipleFileMenu";
import fileContext from "../context/fileContext";

const FilesInsideFolder = () => {
  const { formatFileSize } = useAuth();
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { darkMode } = useDarkMode();
  const { folderName, folderId } = useParams();
  const { departments } = useDepartment();

  const [select, setSelect] = useState(false);
  const [showMultiFileOptions, setShowMultiFileOptions] = useState(false);
  const context = useContext(fileContext);

  useEffect(() => {
    listFilesInFolder(folderId);
  }, [auth.currentUser, folderId]);

  const listFilesInFolder = async (folder_id) => {
    try {
      const response = await api.get(`/file/folder/listFiles/${folder_id}`);

      if (response) {
        const mappedFiles = response.data.map((file) => {
          try {
            const [{ depts }, ...extra] = file.file_info;
            const [{ name }, ...more] = depts;
            file.department = name;
          } catch (err) {
            file.department = "";
          }

          const filteredDepartment = departments.filter(
            (dept) => dept.id === file.department_ids[0]
          );

          return {
            id: file.id,
            name: file.name.substring(0, 80),
            profilePic: file.profile_pic,
            size: formatFileSize(file.metadata.size),
            dept: file.department_ids,
            owner: file.owner_id,
            mimetype: file.metadata.mimetype,
            status: "Team",
            security: "Enhanced",
            color: filteredDepartment[0]?.metadata.bg,
            isLocked: file?.is_locked,
            hasPassword: file?.has_password,
            password: file?.password,
            isPinned: file?.is_pinned,
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
        console.log("MAPPED FILES", mappedFiles);
        setFiles(mappedFiles);
      }
    } catch (error) {
      console.log("error occured while fetching files inside folders", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredFiles = files.filter((file) => {
    // Perform the filter operation
    return file.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const removeFile = (fileToRemove) => {
    const removedFiles = files.filter((file) => file.id !== fileToRemove);
    setFiles(removedFiles);
  };

  const removeFiles = () => {
    const idsToRemove = context.selectedFiles.map((file) => file.id);

    const updatedFiles = files.filter((file) => !idsToRemove.includes(file.id));

    setFiles(updatedFiles);
  };

  const addFiles = (files) => {
    setFiles((prevData) => [...files, ...prevData]);
  };

  const updateFiles = (file, changedAttr, val) => {
    setFiles((prevData) =>
      prevData.map((data) =>
        data.id === file.id ? { ...data, [changedAttr]: val } : data
      )
    );
  };

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between items-center my-2">
        <h2 className="text-2xl font-semibold my-2">{folderName} :</h2>
        <div className="flex">
          {showMultiFileOptions && (
            <MultipleFileMenu
              removeMultiSelect={() => setSelect(false)}
              removeFiles={removeFiles}
              addFiles={addFiles}
              location="folder"
              id={folderId}
              listFilesInFolder={listFilesInFolder}
            />
          )}
          <button
            className="py-1 px-4 rounded-md border"
            onClick={() => setSelect(!select)}
            style={{
              backgroundColor: select ? "grey" : "#1c4ed8",
              color: "white",
            }}
          >
            Select Files
          </button>
          <AddFilesInsideFolder
            folderId={folderId}
            listFilesInFolder={listFilesInFolder}
          />
        </div>
      </div>

      {/* Search bar */}
      <div className="flex justify-end -mt-2 items-center pb-4">
        <input
          type="text"
          placeholder="Search by file name"
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-md px-3 py-2"
        />
      </div>
      <div>
        <RecentFiles
          filteredData={filteredFiles}
          removeFile={removeFile}
          select={select}
          setSelect={setSelect}
          showMultiFileOptions={showMultiFileOptions}
          setShowMultiFileOptions={setShowMultiFileOptions}
          updateFiles={updateFiles}
        />
      </div>
    </div>
  );
};

export default FilesInsideFolder;
