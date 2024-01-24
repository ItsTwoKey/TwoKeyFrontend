import React from "react";
import PDFicon from "../assets/pdf.svg";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import LeftArrow from "../assets/leftArrow.svg";
import Trash from "../assets/trash.svg";
import DownloadFile from "../assets/downloadFile.svg";
import { supabase } from "../helper/supabaseClient";
import axios from "axios";
import AIChat from "./AIChat";
import { useNavigate } from "react-router-dom";

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

const FileDetails = ({
  fileInfo,
  sharedFileInfo,
  closeDrawer,
  preUrl,
  signedUrl,
}) => {
  const navigate = useNavigate();
  console.log("fileInfo", fileInfo);
  console.log("sharedFileInfo", sharedFileInfo);

  // Function to format the date
  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    const formattedDate = new Date(dateString).toLocaleString("en-IN", options);
    return formattedDate;
  };

  const handleBackButtonClick = () => {
    closeDrawer();
  };

  const downloadAlert = async (fileId) => {
    try {
      let token = JSON.parse(localStorage.getItem("token"));

      if (fileId) {
        const res = await axios.get(
          `https://twokeybackend.onrender.com/file/logEvent/${fileId}?event=download`,

          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log("download log :", res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getIconByMimeType = (mimeType) => {
    // Use the fileIcons object to get the appropriate SVG icon
    return fileIcons[mimeType] || PDF; // Default to PDF icon if not found
  };

  const handleDownload = async () => {
    try {
      // Create a temporary anchor element
      const downloadLink = document.createElement("a");
      downloadLink.href = preUrl;
      downloadLink.download = fileInfo.name;

      // Append the anchor element to the document and click it to trigger the download
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Remove the anchor element from the document
      document.body.removeChild(downloadLink);

      console.log("Download success");
      await downloadAlert(fileInfo.id);
    } catch (error) {
      console.error(
        "Error occurred while downloading the file:",
        error.message
      );
    }
  };

  const handleDelete = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("TwoKey")
        .remove([fileInfo.name]);

      if (error) {
        console.error("Error deleting file:", error.message);
      } else {
        console.log("Delete success", data);
        closeDrawer();
      }
    } catch (error) {
      console.error("Error occurred while deleting the file:", error.message);
    }
  };

  return (
    <div className="bg-[#525659] h-screen text-white p-6 flex flex-col justify-between">
      {/* <button onClick={handleBackButtonClick}>Back</button> */}

      <div>
        <span className="flex flex-row justify-between">
          <span className="flex flex-row">
            <img
              src={LeftArrow}
              alt="←"
              onClick={handleBackButtonClick}
              className="cursor-pointer"
            />
            <h4 className="text-sm font-semibold">File Details</h4>
          </span>
          <span className="flex flex-row gap-1">
            <img
              onClick={handleDelete}
              src={Trash}
              alt="delete"
              className="cursor-pointer"
            />
            <img
              onClick={handleDownload}
              src={DownloadFile}
              alt="download"
              className="cursor-pointer"
            />
          </span>
        </span>

        {/* <img src={PDFicon} alt="PDF Icon" className="my-4" /> */}
        <div className="flex justify-center items-center my-8">
          <img
            src={getIconByMimeType(fileInfo.mimetype)}
            alt="File Preview"
            className="rounded-md h-24 w-24"
          />
        </div>

        <span className="my-2">
          <h2 className="text-sm text-gray-400 font-semibold">File Name</h2>
          <p className="text-sm text-gray-300 line-clamp-1">
            {fileInfo.name.split("_TS=")[0]}
          </p>
        </span>

        <span className="flex flex-row justify-between text-xs font-semibold text-gray-400 leading-6 my-2">
          <span className="flex flex-col items-center">
            <p className="">Type</p>
            <p className="text-gray-300">
              {fileInfo.name.split(".").pop().split("_TS=")[0]}
            </p>
          </span>
          <span className="flex flex-col items-center">
            <p className="">Size</p>
            <p className="text-gray-300">{fileInfo.size}</p>
          </span>
          <span className="flex flex-col items-center">
            <p className="">Last modified</p>
            <p className="text-gray-300">{formatDate(fileInfo.lastUpdate)}</p>
          </span>
        </span>

        <span className="flex flex-col gap-2 my-2">
          <h2 className="text-sm text-gray-400 font-semibold">File Owner</h2>
          <span className="flex flex-row items-center gap-2">
            <Avatar
              src={fileInfo.ownerProfileUrl}
              alt="owner pic"
              sx={{ width: 20, height: 20 }}
            />
            <p className="text-xs text-gray-300 font-semibold">
              {sharedFileInfo.owner}
            </p>
          </span>
        </span>

        <span className="flex flex-col gap-2">
          <p className="text-sm text-gray-400 font-semibold">Who has access</p>

          {sharedFileInfo?.shared_with?.map((user) => (
            <span key={user.user_id} className="flex flex-row items-center">
              <Tooltip title={user.user_email} arrow>
                <Avatar
                  src={user.profile_pic}
                  alt="owner pic"
                  sx={{ width: 20, height: 20, marginRight: 1 }}
                />
              </Tooltip>
              <p className="text-xs text-gray-300 font-semibold">
                {user.first_name} {user.last_name}
              </p>
            </span>
          ))}
        </span>
      </div>
      <div className="text-right">
        {/* <button
          className="h-12 w-12 shadow-lg border border-gray-500 bg-[#3C4042] rounded-full"
          onClick={handleAIClick}
        >
          <img src={AI} alt="AI" className="mx-auto" />
        </button> */}

        <AIChat signedUrl={signedUrl} />
      </div>
    </div>
  );
};

export default FileDetails;
