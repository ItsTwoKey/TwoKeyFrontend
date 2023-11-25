import React, { useEffect, useState } from "react";
import axios from "axios";
import FileView from "./FileView";
import PDFPreview from "../assets/pdfPreviewDummy.jpg";
import QuickShare from "../components/QuickShare";
import { useDarkMode } from "../context/darkModeContext";
import { Skeleton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../context/authContext";

const RecentFiles = () => {
  const { darkMode } = useDarkMode();
  const { filteredData } = useAuth();
  const [selectedFileInfo, setSelectedFileInfo] = useState({
    name: "",
    size: "",
    id: "",
    owner: "",
    profileUrl: "",
    lastUpdate: "",
  });
  const [loading, setLoading] = useState(true);
  const [sharedFileInfo, setSharedFileInfo] = useState({});
  const [isFileViewOpen, setIsFileViewOpen] = useState(false);

  const getSharedFileInfo = async (fileId) => {
    try {
      let token = JSON.parse(sessionStorage.getItem("token"));
      const info = await axios.get(
        `https://twokeybackend.onrender.com/file/sharedFileInfo/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      setSharedFileInfo(info.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openDrawer = (
    fileName,
    fileSize,
    fileId,
    owner,
    publicUrl,
    lastUpdate
  ) => {
    getSharedFileInfo(fileId);
    setSelectedFileInfo({
      name: fileName,
      size: fileSize,
      id: fileId,
      owner: owner,
      ownerProfileUrl: publicUrl,
      lastUpdate: lastUpdate,
    });
    setIsFileViewOpen(true);
  };

  const closeDrawer = () => {
    setIsFileViewOpen(false);
  };

  useEffect(() => {
    async function fetchRecentFiles() {
      try {
        // Fetch recent files logic
        console.log("Recent files:", filteredData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false);
      }
    }
    fetchRecentFiles();
  }, []);

  return (
    <div>
      <div
        className={`flex flex-row justify-between items-center ${
          darkMode && "text-gray-200"
        }`}
      >
        <p className="text-lg font-semibold my-4 ">Recent Files</p>
        <span className="flex gap-2">
          <button
            className={`py-1 px-4 rounded-md border ${
              darkMode ? "bg-gray-600 border-gray-500" : "bg-gray-50"
            } `}
          >
            + Share
          </button>
          <QuickShare />
        </span>
      </div>
      <div
        className={`grid grid-cols-5 gap-4 bg-inherit ${
          darkMode ? "text-gray-200" : "text-gray-600"
        }`}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 p-2 rounded-lg shadow-md"
              >
                <Skeleton variant="rounded" height={110} />
                <span>
                  <h5 className="font-semibold">
                    <Skeleton height={28} width={160} />
                  </h5>
                  <h6 className="text-sm font-semibold">
                    <Skeleton height={22} width={70} />
                  </h6>
                  <p className="text-xs text-gray-500 font-light">
                    <Skeleton height={18} width={60} />
                  </p>
                </span>
              </div>
            ))
          : filteredData.slice(0, 5).map((file, index) => (
              <div
                key={index}
                className={`border border-gray-200 p-2 rounded-lg shadow-md cursor-pointer ${
                  darkMode ? "border-gray-500" : "border-gray-200"
                }`}
                onClick={() =>
                  openDrawer(
                    file.name,
                    file.size,
                    file.id,
                    file.owner,
                    file.publicUrl,
                    file.lastUpdate
                  )
                }
              >
                <img
                  src={PDFPreview}
                  alt="File Preview"
                  className="rounded-md"
                />
                <span>
                  <h5 className="font-semibold">{file.name.slice(0, 15)}</h5>
                  <span className="flex flex-row justify-between items-center">
                    <span>
                      <h6 className="text-sm font-semibold">File Info:</h6>
                      <p className="text-xs  font-light">{file.size}</p>
                    </span>

                    <Avatar
                      src={file.publicUrl}
                      alt="owner pic"
                      sx={{ width: 20, height: 20 }}
                      className={`${darkMode && "border border-white "}`}
                    />
                  </span>
                </span>
              </div>
            ))}
      </div>
      {isFileViewOpen && (
        <FileView
          fileInfo={selectedFileInfo}
          closeDrawer={closeDrawer}
          sharedFileInfo={sharedFileInfo}
        />
      )}
    </div>
  );
};

export default RecentFiles;
