import React, { useEffect, useState } from "react";
import axios from "axios";
import FileView from "./FileView";
import PDF from "../assets/pdf.svg";
import { supabase } from "../helper/supabaseClient";
import ShareFile from "./ShareFile";
import SecureShare from "./SecureShare";
import { useDarkMode } from "../context/darkModeContext";
import { Skeleton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../context/authContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FileInfo from "./FileInfo";

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
  });
  const [loading, setLoading] = useState(true);
  const [sharedFileInfo, setSharedFileInfo] = useState({});
  const [isFileViewOpen, setIsFileViewOpen] = useState(false);
  const [isFileInfoOpen, setIsFileInfoOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
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
    lastUpdate
  ) => {
    getSharedFileInfo(fileId);
    setSelectedFileInfo({
      name: fileName,
      size: fileSize,
      id: fileId,
      owner: owner,
      ownerProfileUrl: profilePic,
      lastUpdate: lastUpdate,
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
    lastUpdate
  ) => {
    getSharedFileInfo(fileId);
    setSelectedFileInfo({
      name: fileName,
      size: fileSize,
      id: fileId,
      owner: owner,
      ownerProfileUrl: profilePic,
      lastUpdate: lastUpdate,
    });
    setIsFileInfoOpen(true);
  };

  const closeFileInfoDrawer = () => {
    setIsFileInfoOpen(false);
  };

  const handleDelete = async (fileName) => {
    try {
      console.log(fileName);
      const { data, error } = await supabase.storage
        .from("TwoKey")
        .remove(fileName);

      if (error) {
        console.error("Error deleting file:", error.message);
      } else {
        console.log("Delete success", data);
        setAnchorEl(null);
      }
    } catch (error) {
      console.error("Error occurred while deleting the file:", error.message);
    }
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
          {/* <button
            className={`py-1 px-4 rounded-md border ${
              darkMode ? "bg-gray-600 border-gray-500" : "bg-gray-50"
            } `}
          >
            + Share
          </button> */}

          <SecureShare />
          <ShareFile />
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
                className="border border-gray-200 p-2 rounded-lg shadow-md"
              >
                <Skeleton variant="rounded" height={110} />
                <span>
                  <h5 className="font-semibold">
                    <Skeleton height={28} width={160} />
                  </h5>
                  <span className="flex flex-row justify-between items-center">
                    <span>
                      <h6 className="text-sm font-semibold">
                        <Skeleton height={22} width={70} />
                      </h6>

                      <p className="text-xs text-gray-500 font-light">
                        <Skeleton height={18} width={60} />
                      </p>
                    </span>
                    <Skeleton variant="circular" height={20} width={20} />
                  </span>
                </span>
              </div>
            ))
          : filteredData.slice(0, 5).map((file, index) => (
              <div
                key={index}
                className={`border border-gray-200 bg-[#FFF6F6] p-3 rounded-[16px] cursor-pointer `}
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
                        file.lastUpdate
                      )
                    }
                  >
                    <b className="text-gray-500 font-serif text-xs border-2 border-gray-500 rounded-full px-[5px] mx-1">
                      i
                    </b>
                  </button>

                  <span>
                    <button
                      className="rotate-90 text-lg"
                      onClick={handleMenuClick}
                    >
                      ...
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
                        onClick={handleClose}
                        style={{ padding: "0px 10px" }}
                      >
                        Share
                      </MenuItem>
                      <MenuItem style={{ padding: "0px 10px" }}>
                        <button
                          onClick={() => {
                            // Log the selected file's name when "Edit" is clicked
                            console.log(
                              "Edit file:",
                              file.name,
                              "Index:",
                              index
                            );
                          }}
                        >
                          Edit
                        </button>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDelete(file.name)}
                        style={{ padding: "0px 10px", color: "#D1293D" }}
                      >
                        Remove
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
                      file.lastUpdate
                    )
                  }
                >
                  <span className="flex justify-center items-center">
                    <img src={PDF} alt="File Preview" className="rounded-md" />
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
                          width: 20,
                          height: 20,
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
