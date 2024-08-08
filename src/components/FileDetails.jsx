import React, { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Trash from "../assets/trash.svg";
import DownloadFile from "../assets/downloadFile.svg";
// import AIChat from "./AIChat";
import { useNavigate } from "react-router-dom";

import PDF from "../assets/pdf.svg";
import Doc from "../assets/doc.svg";
import Image from "../assets/image.svg";
import Ppt from "../assets/ppt.svg";
import Txt from "../assets/txt.svg";
import Video from "../assets/video.svg";
import secureLocalStorage from "react-secure-storage";
import { deleteObject, getStorage, ref } from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";
import fileContext from "../context/fileContext";
import { api } from "../utils/axios-instance";
import { auth } from "../helper/firebaseClient";
import { Icon, IconButton } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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
  const context = useContext(fileContext);
  const { removeFile, updateDepartmentFiles } = context;

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
    const token = auth.currentUser && (await auth.currentUser.getIdToken());
    try {
      if (fileId) {
        const res = await api.post(`/file/logEvent/${fileId}?event=download`, {
          event: "download",
          idToken: token,
        });
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
      downloadLink.download = fileInfo.name.split("_TS=")[0];

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

  console.log("fileInfo", fileInfo);

  const handleDelete = async () => {
    let profileData = JSON.parse(secureLocalStorage.getItem("profileData"));

    // Check if the user is the owner of the file
    // console.log(fileName);

    if (profileData.id === fileInfo.owner) {
      try {
        const storage = getStorage();
        const fileRef = ref(
          storage,
          `files/${profileData.org}/${fileInfo.id}`
        );

        await deleteObject(fileRef);
        console.log("Delete success");

        const res = await api.delete(`/file/delete-file/${fileInfo.id}/`);

        removeFile(fileInfo.id);
        // if (deptName) updateDepartmentFiles(deptName);

        toast.success("File deleted successfully.");
        handleBackButtonClick();
      } catch (error) {
        toast.error("Error occurred while deleting the file");
        console.error("Error occurred while deleting the file:", error.message);
      }
    } else {
      // Display Snackbar message if the user is not the owner of the file

      toast.error("You are not the owner of this file.");
    }
  };

  return (
    console.log(fileInfo),
    (
      <div className="bg-[#FAFAFA] h-[30px] text-white py-8 px-4 flex justify-between">
        {/* <button onClick={handleBackButtonClick}>Back</button> */}
        <Toaster position="bottom-left" reverseOrder={false} />
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <span className="flex-shrink-0">
              {/* <img
                src={LeftArrow}
                alt="←"
                onClick={handleBackButtonClick}
                className="cursor-pointer"
              /> */}
              <img
                src={getIconByMimeType(fileInfo.mimetype)}
                alt="File Preview"
                className="cursor-pointer rounded-md h-8 w-8"
                onClick={handleBackButtonClick}
              />
            </span>

            <div className="mx-2">
              <p className="text-md text-black font-semibold whitespace-nowrap overflow-hidden text-ellipsis ml-1 ">
                {fileInfo.name.split("_TS=")[0]}
              </p>
              <div className="flex gap-2 w-[500px]">
                <p
                  onClick={handleBackButtonClick}
                  className="hover:bg-slate-200 cursor-pointer px-1 rounded-sm text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  Home
                </p>
                <p className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                  {fileInfo.name.split(".").pop().split("_TS=")[0]}
                </p>
                <p className="text-sm text-gray-600">{fileInfo.size}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-end w-full">
            {/* <span className="flex flex-col gap-2">
              <p className="text-sm text-gray-400 font-semibold">
                Who has access
              </p>

              {sharedFileInfo?.shared_with?.map((user) => (
            <span key={user.user_id} className="flex flex-row items-center">
              <Tooltip title={user?.email} arrow>
                <Avatar
                  src={user.profilePictureUrl}
                  alt="owner pic"
                  sx={{ width: 20, height: 20, marginRight: 1 }}
                />
              </Tooltip>
              <p className="text-xs text-gray-300 font-semibold">
                {user.first_name} {user.last_name}
              </p>
            </span>
          ))}
            </span> */}

            {/* <img
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
              /> */}
            <Tooltip
              title={`Last modified ${formatDate(fileInfo.lastUpdate)}`}
              arrow
            >
              <IconButton>
                <HistoryIcon className="" />
              </IconButton>
            </Tooltip>
            {/* <IconButton onClick={handleDownload}>
              <DownloadForOfflineIcon />
            </IconButton> */}
            <IconButton onClick={handleDelete}>
              <DeleteForeverIcon />
            </IconButton>
            {/* <AIChat signedUrl={signedUrl} /> */}

            <Tooltip title="Owner" arrow>
              <Avatar
                src={fileInfo.ownerProfileUrl}
                alt="owner pic"
                sx={{ width: 28, height: 28 }}
                className="cursor-pointer ml-2"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    )
  );
};

export default FileDetails;
