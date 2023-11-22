import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { supabase } from "../helper/supabaseClient";
import { useAuth } from "../context/authContext";
import PDFPreview from "../assets/pdfPreview.jpg";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

const FileDrawer = ({
  isDrawerOpen,
  closeDrawer,
  selectedFileInfo,
  sharedFileInfo,
}) => {
  const [sharedWith, setSharedWith] = useState({});
  const {
    isFileViewerOpen,
    openFileViewer,
    closeFileViewer,
    screenshotDetected,
  } = useAuth();

  // console.log("getSharedFileInfo filedrawer:", sharedFileInfo.shared_with);

  const toggleFileViewer = () => {
    if (isFileViewerOpen) {
      closeFileViewer();
    } else {
      openFileViewer();
    }
  };

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("TwoKey")
        .download(selectedFileInfo.name);
      console.log("Download success", data);
    } catch (error) {
      console.log("Error occured while downloading the file.");
    }
  };

  const handleDelete = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("TwoKey")
        .remove(selectedFileInfo.name);
      console.log("Delete success", data);
    } catch (error) {
      console.log("Error occured while deleting the file.");
    }
  };

  const getPresignedUrl = async () => {
    try {
      let token = JSON.parse(sessionStorage.getItem("token"));

      const body = {
        latitude: 18.44623721673684,
        longitude: 73.82762833796289,
      };
      const presignedUrl = await axios.post(
        `https://twokeybackend.onrender.com/file/getPresigned/${selectedFileInfo.id}/`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log("presignedUrl:", presignedUrl.data.signed_url);
      localStorage.setItem("preUrl", presignedUrl.data.signed_url);

      toggleFileViewer();
    } catch (error) {
      console.log("Error while getPresignedUrl", error);
    }
  };

  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
      <div
        className={`drawer-content w-64 p-4 bg-white bg-inherit ${
          screenshotDetected ? "blur" : ""
        }`}
      >
        <IconButton onClick={closeDrawer}>
          <ChevronRightIcon />
        </IconButton>
        <h4 className="font-semibold text-sm">File Preview</h4>
        <div className="flex flex-col justify-center items-center">
          <div className="bg-gray-100 my-2 rounded-md shadow-md">
            <img src={PDFPreview} alt="preview" />
          </div>
          <h2>{selectedFileInfo.name.slice(0, 15)}</h2>
          {/* <h2>{selectedFileId}</h2> */}
        </div>
        <hr className="my-2" />
        <h4 className="font-semibold text-sm text-gray-900">Description</h4>
        <p className="text-xs font-semibold my-2 line-clamp-3 leading-4 text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>

        <hr className="my-2" />

        <h4 className="font-semibold text-sm my-2 text-gray-900">
          File Information
        </h4>

        <span className="flex flex-col gap-1">
          <p className="text-xs font-bold">Who has access</p>

          {sharedFileInfo?.shared_with?.map((user) => (
            <Tooltip key={user.user_id} title={user.user_email} arrow>
              <Avatar
                src={user.profile_pic}
                alt="owner pic"
                sx={{ width: 20, height: 20 }}
              />
            </Tooltip>
          ))}
        </span>
        <span className="flex flex-col gap-1 my-2">
          <p className="text-xs font-bold">File Owner</p>
          <Tooltip title={selectedFileInfo.owner} arrow>
            <Avatar
              src={selectedFileInfo.ownerProfileUrl}
              alt="owner pic"
              sx={{ width: 20, height: 20 }}
            />
          </Tooltip>
        </span>

        <hr className="my-2" />
        <h4 className="font-semibold text-sm my-2 text-gray-900">Properties</h4>
        <span className="flex flex-col text-xs font-semibold text-gray-400 leading-5 p-2">
          <span className="flex justify-between items-center">
            <p className="">Type</p>
            <p>pdf</p>
          </span>
          <span className="flex justify-between items-center">
            <p className="">Size</p>
            <p>{selectedFileInfo.size}</p>
          </span>
          <span className="flex justify-between items-center">
            <p className="">Last modified</p>
            <p>{selectedFileInfo.lastUpdate}</p>
          </span>
        </span>
        {/* <button
          className="bg-green-600 text-white py-1 px-4 rounded-md w-full my-2"
          onClick={toggleFileViewer}
        >
          Open
        </button> */}
        <button
          className="bg-blue-600 text-white py-1 px-4 rounded-md w-full my-2"
          onClick={getPresignedUrl}
        >
          Open
        </button>
        <span className="flex justify-between gap-2">
          <button
            className="bg-green-600 text-white py-1 px-4 rounded-md w-full my-2"
            onClick={handleDownload}
          >
            Download
          </button>
          <button
            className="bg-red-500 text-white py-1 px-4 rounded-md w-full my-2"
            onClick={handleDelete}
          >
            Delete
          </button>
        </span>
      </div>
    </Drawer>
  );
};

export default FileDrawer;
