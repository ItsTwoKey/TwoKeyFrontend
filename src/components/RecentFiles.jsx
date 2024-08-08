import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FileView from "./FileView";
import { useDarkMode } from "../context/darkModeContext";
import { Skeleton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FileInfo from "./FileInfo";
import FileShare from "./FileShare";
import threeDots from "../assets/threedots.svg";
import DeleteFileConfirmation from "./DeleteFileConfirmation";

import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DoneIcon from "@mui/icons-material/Done";
import PDF from "../assets/pdf.svg";
import Doc from "../assets/doc.svg";
import Image from "../assets/image.svg";
import Ppt from "../assets/ppt.svg";
import Txt from "../assets/txt.svg";
import Video from "../assets/video.svg";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";

import secureLocalStorage from "react-secure-storage";
import fileContext from "../context/fileContext";
import { api } from "../utils/axios-instance";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

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

const RecentFiles = ({
  filteredData,
  loading,
  select,
  setSelect,
  showMultiFileOptions,
  setShowMultiFileOptions,
  removeFile,
  value,
  updateFiles,
  deptName,
}) => {
  const location = useLocation();
  const { darkMode } = useDarkMode();
  const [selectedFileInfo, setSelectedFileInfo] = useState({
    name: "",
    size: "",
    id: "",
    owner: "",
    profileUrl: "",
    lastUpdate: "",
    mimetype: "",
    download_url: "",
  });
  // const [loading, setLoading] = useState(true);
  const [sharedFileInfo, setSharedFileInfo] = useState({});
  const [isFileViewOpen, setIsFileViewOpen] = useState(false);
  const [isFileInfoOpen, setIsFileInfoOpen] = useState(false);
  // const [anchorEl, setAnchorEl] = useState(null);
  const context = useContext(fileContext);
  const { anchorEl, setAnchorEl, updateFilesState, updateDepartmentFiles } =
    context;
  const [menuFile, setMenuFile] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { profileData } = useAuth();

  const open = Boolean(anchorEl);

  const recentBgColor = ["#FFF6F6", "#FFF6FF", "#F6FFF6", "#F6F7FF", "#FFFFF6"];

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("custom_all_channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "file_info" },
  //       () => {
  //         console.log("rendered due to subscribe");
  //         fetchRecentFiles();
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, []); // Include fetchDashboardFiles in the dependency array

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getSharedFileInfo = async (fileId) => {
    try {
      const info = await api.get(`/file/sharedFileInfo/${fileId}/`);
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
    mimetype,
    download_url,
    isLocked
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
      download_url: download_url,
    });

    if (isLocked) {
      toast.error("File has been locked by organization admin!");
    } else {
      setIsFileViewOpen(true);
    }
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
    mimetype,
    download_url
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
      download_url: download_url,
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

  const handleMultiFileSelect = (file) => {
    console.log(file);

    if (!file.isLocked) {
      if (selectedFiles.includes(file)) {
        const newSelectedFiles = selectedFiles.filter(
          (selectedFile) => selectedFile.id !== file.id
        );
        setSelectedFiles(newSelectedFiles);
      } else {
        setSelectedFiles([...selectedFiles, file]);
      }
    } else {
      toast.error("You cannot perform actions on locked files!");
    }
  };

  const handleLockChange = async (file) => {
    if (profileData.role_priv !== "employee") {
      const id = file.id;
      const res = await api.patch(`/file/change-lock-status/${id}/`, {
        is_locked: !file?.isLocked,
      });
    }

    updateUI("isLocked", file, !file?.isLocked);
  };

  const handlePinChange = async (file) => {
    const id = file.id;
    const res = await api.patch(`/file/change-pin-status/${id}/`, {
      is_pinned: !file.isPinned,
    });

    updateUI("isPinned", file, !file?.isPinned);
  };

  const updateUI = (changedAttr, file, newVal) => {
    const curr_location = location?.pathname.split("/")[1];

    switch (curr_location) {
      case "dashboard":
        updateFilesState(value);
        break;
      case "filesInsideFolder":
        updateFiles(file, changedAttr, newVal);
        break;
      case "department":
        updateDepartmentFiles(deptName);
        break;
      default:
        console.log("UNEXPECTED INPUT");
    }
  };

  useEffect(() => {
    if (!select) {
      setSelectedFiles([]);
    }
  }, [select]);

  useEffect(() => {
    if (selectedFiles.length > 0 && !showMultiFileOptions) {
      setShowMultiFileOptions(true);
    }

    if (showMultiFileOptions && selectedFiles.length === 0) {
      setShowMultiFileOptions(false);
      setSelect(false);
    }

    context.setSelectedFiles(selectedFiles);
  }, [selectedFiles]);

  return (
    <div>
      <div
        className={`grid grid-cols-5 gap-4 ${
          darkMode ? "text-gray-200" : "text-gray-600"
        }`}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 p-3 rounded-2xl shadow-sm"
              >
                <span className="flex flex-row justify-between items-center px-1 my-1">
                  <Skeleton variant="circular" height={22} width={22} />
                  <img src={threeDots} alt="..." height={25} width={25} />
                </span>

                <span className="">
                  <Skeleton variant="rounded" height={60} width="100%" />
                  <span className="font-semibold">
                    <Skeleton height={22} width="100%" />
                  </span>
                </span>

                <span>
                  <span className="flex flex-row justify-between items-center my-1 px-1">
                    <span className="w-full text-sm text-gray-500 font-light">
                      <Skeleton height={18} width="70%" />
                    </span>
                    <Skeleton variant="circular" height={22} width={22} />
                  </span>
                </span>
              </div>
            ))
          : filteredData.map((file, index) => (
              <div
                key={index}
                className={`border border-gray-200 p-3 rounded-[16px] cursor-pointer relative`}
                style={{
                  backgroundColor: file.color || `#f9f9f9`,
                }}
              >
                <div
                  className="w-full h-full absolute left-0 top-0 items-center justify-center rounded-[16px]"
                  onClick={() => handleMultiFileSelect(file)}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    display:
                      selectedFiles.includes(file) && select ? "flex" : "none",
                  }}
                >
                  <div className="py-3 px-3 rounded-full bg-green-400">
                    <DoneIcon />
                  </div>
                </div>
                <span className="flex justify-between items-center">
                  <button
                    onClick={() =>
                      select
                        ? handleMultiFileSelect(file)
                        : openFileInfoDrawer(
                            file.name,
                            file.size,
                            file.id,
                            file.owner,
                            file.profilePic,
                            file.lastUpdate,
                            file.mimetype,
                            file.downloadUrl
                          )
                    }
                  >
                    <b className="text-gray-500 font-serif text-xs border-2 border-gray-500 rounded-full px-[5px] mx-1">
                      i
                    </b>
                  </button>

                  <span className="flex">
                    <div onClick={() => handleLockChange(file)}>
                      {file?.isLocked ? <LockIcon /> : <LockOpenIcon />}
                    </div>
                    <div onClick={() => handlePinChange(file)} className="ml-1">
                      {file?.isPinned ? (
                        <PushPinIcon />
                      ) : (
                        <PushPinOutlinedIcon />
                      )}
                    </div>
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
                      {/* <MenuItem style={{ padding: "0px 10px" }}>
                        <button
                          onClick={() => {
                            // Log the selected file's name when "Edit" is clicked
                            console.log("Edit file:", menuFile.name);
                          }}
                        >
                          Edit
                        </button>
                      </MenuItem> */}

                      <MenuItem
                        style={{ padding: "0px 10px", color: "#D1293D" }}
                      >
                        <DeleteFileConfirmation
                          fileName={menuFile.name}
                          owner={menuFile.owner}
                          id={menuFile.id}
                          remove={removeFile}
                        />
                      </MenuItem>
                    </Menu>
                  </span>
                </span>

                <div
                  onClick={() =>
                    select
                      ? handleMultiFileSelect(file)
                      : openDrawer(
                          file.name,
                          file.size,
                          file.id,
                          file.owner,
                          file.profilePic,
                          file.lastUpdate,
                          file.mimetype,
                          file.downloadUrl,
                          file.isLocked
                        )
                  }
                >
                  <span className="flex justify-center items-center">
                    {/* Use the getIconByExtension function to determine the correct SVG */}
                    <img
                      src={getIconByMimeType(file.mimetype)}
                      alt="File Preview"
                      className="rounded-md my-2"
                    />
                  </span>
                  <span>
                    <h5 className="font-semibold line-clamp-1 text-gray-700 text-sm mb-1">
                      {file.name.split("_TS=")[0]}
                    </h5>
                    <span className="flex flex-row justify-between items-center">
                      <span>
                        <h6 className="font-semibold">
                          {/* <span className="text-xs font-bold text-[#676767]">
                            File size:
                          </span>{" "} */}
                          <span className="text-xs font-bold text-[10px] text-[#676767]">
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
