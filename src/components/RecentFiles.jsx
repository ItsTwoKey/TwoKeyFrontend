import React, { useEffect, useState } from "react";
import axios from "axios";
import FileView from "./FileView";
// import ShareFile from "./ShareFile";
import SecureShare from "./SecureShare";
import { useDarkMode } from "../context/darkModeContext";
import { Skeleton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../context/authContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FileInfo from "./FileInfo";
import FileShare from "./FileShare";
import UploadFile from "./UploadFile";
import threeDots from "../assets/threedots.svg";
import DeleteFileConfirmation from "./DeleteFileConfirmation";

import PDF from "../assets/pdf.svg";
import Doc from "../assets/doc.svg";
import Image from "../assets/image.svg";
import Ppt from "../assets/ppt.svg";
import Txt from "../assets/txt.svg";
import Video from "../assets/video.svg";
import ThreeDotsIcon from "../assets/threedots.svg";

// Define SVG icons for different file types
const fileIcons = {
  "image/png": Image,
  "image/jpeg": Image,
  "application/pdf": PDF,
  "application/msword": Doc,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    Doc,
  "application/vnd.ms-powerpoint": Ppt,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    Ppt,
  "text/plain": Txt,
  "video/mp4": Video,
  // Add more as needed
};

const RecentFiles = () => {
  const { darkMode } = useDarkMode();
  const { formatFileSize } = useAuth();
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFileInfo, setSelectedFileInfo] = useState({
    name: "",
    size: "",
    id: "",
    owner: "",
    profileUrl: "",
    lastUpdate: "",
    mimetype: "",
  });
  const [loading, setLoading] = useState(true);
  const [sharedFileInfo, setSharedFileInfo] = useState({});
  const [isFileViewOpen, setIsFileViewOpen] = useState(false);
  const [isFileInfoOpen, setIsFileInfoOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuFile, setMenuFile] = useState({});

  const open = Boolean(anchorEl);

  const recentBgColor = ["#FFF6F6", "#FFF6FF", "#F6FFF6", "#F6F7FF", "#FFFFF6"];

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        const cacheKey = "recentFilesCache";

        // Check if recent files data is available in localStorage
        const cachedRecentFiles = localStorage.getItem(cacheKey);

        if (cachedRecentFiles) {
          console.log(
            "Using cached recent files:",
            JSON.parse(cachedRecentFiles)
          );
          setFilteredData(JSON.parse(cachedRecentFiles));
          setLoading(false);
        }

        let token = JSON.parse(sessionStorage.getItem("token"));

        const recentFilesFromBackend = await axios.get(
          "https://twokeybackend.onrender.com/file/files/?recs=5",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        console.log("Recent files from backend", recentFilesFromBackend.data);

        if (recentFilesFromBackend.data) {
          const mappedFiles = recentFilesFromBackend.data.map((file) => {
            return {
              id: file.id,
              name: file.name.substring(0, 80),
              profilePic: file.profile_pic,
              size: formatFileSize(file.metadata.size),
              dept: file.dept_name,
              owner: file.owner_email,
              mimetype: file.metadata.mimetype,
              status: "Team",
              security: "Enhanced",
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

          // Replace the cached recent files data with the new data
          localStorage.setItem(cacheKey, JSON.stringify(mappedFiles));

          // Update the state with the new data
          setFilteredData(mappedFiles);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchRecentFiles();
  }, []);

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
    profilePic,
    lastUpdate,
    mimetype
  ) => {
    getSharedFileInfo(fileId);
    setSelectedFileInfo({
      name: fileName,
      size: fileSize,
      id: fileId,
      owner: owner,
      ownerProfileUrl: profilePic,
      lastUpdate: lastUpdate,
      mimetype: mimetype,
    });
    setIsFileViewOpen(true);
  };

  const closeDrawer = () => {
    setIsFileViewOpen(false);
  };

  const openFileInfoDrawer = (
    fileName,
    fileSize,
    fileId,
    owner,
    profilePic,
    lastUpdate,
    mimetype
  ) => {
    getSharedFileInfo(fileId);
    setSelectedFileInfo({
      name: fileName,
      size: fileSize,
      id: fileId,
      owner: owner,
      ownerProfileUrl: profilePic,
      lastUpdate: lastUpdate,
      mimetype: mimetype,
    });
    setIsFileInfoOpen(true);
  };

  const closeFileInfoDrawer = () => {
    setIsFileInfoOpen(false);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    // console.log("fileName", fileName);
  };

  const getIconByMimeType = (mimeType) => {
    // Use the fileIcons object to get the appropriate SVG icon
    return fileIcons[mimeType] || PDF; // Default to PDF icon if not found
  };

  return (
    <div>
      <div
        className={`flex flex-row justify-between items-center ${
          darkMode && "text-gray-200"
        }`}
      >
        <p className="text-lg font-semibold my-4 ">Recent Files</p>
        <span className="flex gap-2">
          <SecureShare />
          <UploadFile />
          {/* <ShareFile /> */}
        </span>
      </div>
      <div
        className={`grid grid-cols-5 gap-4 ${
          darkMode ? "text-gray-200" : "text-gray-600"
        }`}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 p-2 rounded-2xl shadow-sm"
              >
                <span className="flex flex-row justify-between items-center px-1 my-1">
                  <Skeleton variant="circular" height={18} width={18} />
                  <span className="flex flex-col items-center justify-center w-6" style={{gap:"2px"}}>
                    <Skeleton variant="circular" width={4} height={4} animation={false} />
                    <Skeleton variant="circular" width={4} height={4} animation={false} />
                    <Skeleton variant="circular" width={4} height={4} animation={false} />
                    {/* <img src={ThreeDotsIcon} alt="" /> */}
                  </span>
                </span>
                <span className="flex flex-col items-center justify-center">
                  <Skeleton variant="rounded" height={60} width={212} />
                  <span className="font-semibold">
                    <Skeleton height={28} width={212} />
                  </span>
                </span>
                <span>
                  <span className="flex flex-row justify-between items-center my-1 px-1">
                    <span className="text-sm text-gray-500 font-light">
                      <Skeleton height={18} width={90} />
                    </span>
                    <Skeleton variant="circular" height={22.4} width={22.4} />
                  </span>
                </span>
              </div>
            ))
          : filteredData.slice(0, 5).map((file, index) => (
              <div
                key={index}
                className={`border border-gray-200 p-3 rounded-[16px] cursor-pointer`}
                style={{ backgroundColor: recentBgColor[index] }}
              >
                <span className="flex justify-between items-center">
                  <button
                    onClick={() =>
                      openFileInfoDrawer(
                        file.name,
                        file.size,
                        file.id,
                        file.owner,
                        file.profilePic,
                        file.lastUpdate,
                        file.mimetype
                      )
                    }
                  >
                    <b className="text-gray-500 font-serif text-xs border-2 border-gray-500 rounded-full px-[5px] mx-1">
                      i
                    </b>
                  </button>

                  <span>
                    <button
                      className=""
                      onClick={(event) => {
                        handleMenuClick(event);
                        setMenuFile(file);
                      }}
                    >
                      <img src={threeDots} height={25} width={25} alt="" />
                    </button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                      PaperProps={{
                        style: {
                          border: "1px solid [#11182626]",
                          boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)",
                          borderRadius: "6px",
                        },
                      }}
                    >
                      <MenuItem
                        // onClick={handleClose}

                        style={{ padding: "0px 10px" }}
                      >
                        <FileShare menuFile={menuFile} />
                      </MenuItem>
                      <MenuItem style={{ padding: "0px 10px" }}>
                        <button
                          onClick={() => {
                            // Log the selected file's name when "Edit" is clicked
                            console.log("Edit file:", menuFile.name);
                          }}
                        >
                          Edit
                        </button>
                      </MenuItem>

                      <MenuItem
                        style={{ padding: "0px 10px", color: "#D1293D" }}
                      >
                        <DeleteFileConfirmation
                          fileName={menuFile.name}
                          owner={menuFile.owner}
                        />
                      </MenuItem>
                    </Menu>
                  </span>
                </span>

                <div
                  onClick={() =>
                    openDrawer(
                      file.name,
                      file.size,
                      file.id,
                      file.owner,
                      file.profilePic,
                      file.lastUpdate,
                      file.mimetype
                    )
                  }
                >
                  <span className="flex justify-center items-center">
                    {/* Use the getIconByExtension function to determine the correct SVG */}
                    <img
                      src={getIconByMimeType(file.mimetype)}
                      alt="File Preview"
                      className="rounded-md"
                    />
                  </span>
                  <span>
                    <h5 className="font-semibold line-clamp-1 text-gray-700 text-sm mb-1">
                      {file.name.split("_TS=")[0]}
                    </h5>
                    <span className="flex flex-row justify-between items-center">
                      <span>
                        <h6 className="font-semibold">
                          <span className="text-xs font-bold text-[#676767]">
                            File size:
                          </span>{" "}
                          <span className="font-normal text-[10px] text-[#909090]">
                            {file.size}
                          </span>
                        </h6>
                      </span>

                      <Avatar
                        src={file.profilePic}
                        alt="owner pic"
                        sx={{
                          width: 24,
                          height: 24,
                          border: "1px solid silver",
                        }}
                        className={`${darkMode && "border border-white "}`}
                      />
                    </span>
                  </span>
                </div>
              </div>
            ))}
      </div>
      {isFileInfoOpen && (
        <FileInfo
          fileInfo={selectedFileInfo}
          closeDrawer={closeFileInfoDrawer}
          sharedFileInfo={sharedFileInfo}
        />
      )}
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
