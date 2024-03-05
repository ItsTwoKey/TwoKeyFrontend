import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import FolderImg from "../assets/folder.svg";
import Avatar from "@mui/material/Avatar";
import { useDarkMode } from "../context/darkModeContext";

import PDF from "../assets/pdf.svg";
import Doc from "../assets/doc.svg";
import Image from "../assets/image.svg";
import Ppt from "../assets/ppt.svg";
import Txt from "../assets/txt.svg";
import Video from "../assets/video.svg";

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

const recentBgColor = ["#FFF6F6", "#FFF6FF", "#F6FFF6", "#F6F7FF", "#FFFFF6"];

const FilesInsideFolder = ({ folderName, files }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode } = useDarkMode();

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const getIconByMimeType = (mimeType) => {
    // Use the fileIcons object to get the appropriate SVG icon
    return fileIcons[mimeType] || PDF; // Default to PDF icon if not found
  };

  return (
    <div className="">
      <button onClick={openDialog} className="">
        <img src={FolderImg} alt="" className="w-full" />
      </button>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            borderRadius: "5px",
          },
        }}
      >
        <DialogTitle>{folderName}</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="grid grid-cols-4 gap-4 py-4">
            {files.map((file, index) => (
              <div
                key={index}
                className={`border border-gray-200 p-3 rounded-[16px] cursor-pointer`}
                style={{ backgroundColor: recentBgColor[index] }}
              >
                <span className="flex justify-center items-center">
                  {/* Use the getIconByExtension function to determine the correct SVG */}
                  <img
                    src={getIconByMimeType(file.mimetype)}
                    alt="File Preview"
                    className="rounded-md h-20 my-3"
                  />
                </span>

                <span className="flex flex-row justify-between items-center">
                  <h5 className="font-semibold line-clamp-1 text-gray-700 text-sm mb-1">
                    {file.name.split("_TS=")[0]}
                  </h5>
                  <Avatar
                    src={file.profile_Pic}
                    alt="owner pic"
                    sx={{
                      width: 24,
                      height: 24,
                      border: "1px solid silver",
                    }}
                    className={`${darkMode && "border border-white "}`}
                  />
                </span>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-2 py-1 mx-2 rounded-lg shadow-sm border border-gray-300"
            onClick={closeDialog}
            color="primary"
          >
            Close
          </button>
          {/* <button
            className="px-2 py-1 rounded-lg shadow-sm bg-[#5E5ADB] text-white"
            onClick={createFolder}
            disabled={!folderName} // Disable button if folderName is empty
          >
            Create Folder
          </button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FilesInsideFolder;
