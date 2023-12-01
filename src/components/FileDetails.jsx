import React from "react";
import PDFicon from "../assets/pdf.svg";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import LeftArrow from "../assets/leftArrow.svg";
import Trash from "../assets/trash.svg";
import DownloadFile from "../assets/downloadFile.svg";
import { supabase } from "../helper/supabaseClient";

const FileDetails = ({ fileInfo, sharedFileInfo, closeDrawer }) => {
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

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("TwoKey")
        .download(fileInfo.name);
      console.log("Download success", data);
    } catch (error) {
      console.log("Error occured while downloading the file.");
    }
  };

  const handleDelete = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("TwoKey")
        .remove(fileInfo.name);
      console.log("Delete success", data);
    } catch (error) {
      console.log("Error occured while deleting the file.");
    }
  };

  return (
    <div className="bg-[#525659] h-full text-white p-6">
      {/* <button onClick={handleBackButtonClick}>Back</button> */}

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

      <img src={PDFicon} alt="PDF Icon" className="my-4" />

      <span className="my-2">
        <h2 className="text-sm text-gray-400 font-semibold">File Name</h2>
        <p className="text-sm text-gray-300">{fileInfo.name.slice(0, 15)}</p>
      </span>

      <span className="flex flex-row justify-between text-xs font-semibold text-gray-400 leading-6 my-2">
        <span className="flex flex-col items-center">
          <p className="">Type</p>
          <p className="text-gray-300">pdf</p>
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
        <Avatar
          src={fileInfo.ownerProfileUrl}
          alt="owner pic"
          sx={{ width: 20, height: 20 }}
        />
      </span>

      <span className="flex flex-col gap-2">
        <p className="text-sm text-gray-400 font-semibold">Who has access</p>

        {sharedFileInfo?.shared_with?.map((user) => (
          <span className="flex flex-row items-center">
            <Tooltip key={user.user_id} title={user.user_email} arrow>
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
  );
};

export default FileDetails;
