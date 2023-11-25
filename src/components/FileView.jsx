import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import PDFPreview from "../assets/pdfPreview.jpg";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Edit from "../assets/edit.svg";
import Hand from "../assets/hand.svg";
import Comment from "../assets/comment.svg";

const FileView = ({ fileInfo, closeDrawer, sharedFileInfo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    // Close the drawer (or do any other necessary action)
    closeDrawer();
  };

  useEffect(() => {
    // Open the dialog when the component mounts
    openDialog();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div className="">
      <Dialog open={isOpen} onClose={closeDialog} fullScreen>
        <DialogTitle
          style={{
            backgroundColor: "#000",
            color: "#fff",
            margin: 0,
            padding: 0,
          }}
        >
          <div className="flex flex-row justify-between items-center py-2">
            <span className="flex">
              <img src={Hand} alt="." />
              <img src={Edit} alt="." />
              <img src={Comment} alt="." />
              {/* <img src={Download} alt="." /> */}
              {/* <img src={Delete} alt="." /> */}
            </span>
            <span className="text-xs text-gray-400 flex">
              {/* add org/dep/file */}
              TwoKey /{" "}
              <p className="mx-1 text-gray-200">
                {" "}
                {fileInfo.name.slice(0, 15)}
              </p>
            </span>
            <button
              className="text-sm text-white py-1.5 px-4 mx-2 rounded-md bg-[#2F8BF9]"
              onClick={closeDialog}
              color="primary"
            >
              Close
            </button>
          </div>
        </DialogTitle>

        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
            margin: 0,
            padding: 0,
          }}
        >
          <div className="flex justify-between h-full">
            <div className="bg-blue-300 flex-1">1</div>
            <div className="bg-white flex-1">
              <h2 className="px-4 py-2 font-bold">
                {fileInfo.name.slice(0, 15)}
              </h2>
              <hr className="border border-white border-b-[#D8DEE4]" />
              <div className="p-2">
                <h4 className="font-bold text-sm my-2 text-gray-900">
                  Properties
                </h4>
                <span className="flex flex-col text-xs font-semibold text-gray-400 leading-5 p-2">
                  <span className="flex justify-between items-center">
                    <p className="">Type</p>
                    <p>pdf</p>
                  </span>
                  <span className="flex justify-between items-center">
                    <p className="">Size</p>
                    <p>{fileInfo.size}</p>
                  </span>
                  <span className="flex justify-between items-center">
                    <p className="">Last modified</p>
                    <p>{fileInfo.lastUpdate}</p>
                  </span>
                </span>
              </div>
              <hr className="border border-white border-b-[#D8DEE4]" />

              <div className="px-4 py-2">
                <h4 className="font-bold text-sm my-2 text-gray-900">
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
                  <Tooltip title={fileInfo.owner} arrow>
                    <Avatar
                      src={fileInfo.ownerProfileUrl}
                      alt="owner pic"
                      sx={{ width: 20, height: 20 }}
                    />
                  </Tooltip>
                </span>
              </div>
              <hr className="border border-white border-b-[#D8DEE4]" />

              <div className="px-4 py-2">
                <h3 className="font-bold text-sm">File Summary</h3>
                <button className="text-sm border border-gray-800 rounded-lg p-2 my-2">
                  Smart Summary AI
                </button>
              </div>
              <hr className="border border-white border-b-[#D8DEE4]" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileView;
