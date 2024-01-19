import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Avatar from "@mui/material/Avatar";

const FileInfo = ({ fileInfo, closeDrawer, sharedFileInfo }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    openDialog();
  }, []);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    closeDrawer();
  };

  console.log(sharedFileInfo);
  console.log(fileInfo);

  return (
    <div className="">
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "5px",
          },
        }}
      >
        <DialogTitle>{fileInfo.name.split("_TS=")[0]}</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] p-3">
            <div className="mb-2">
              <p className="text-md font-semibold text-gray-700 mb-1">
                File Description
              </p>
              <p className="text-sm text-[#1C1C1CB2]">
                Manager can do everything, including managin users and deleting
                current administrators.
              </p>
            </div>

            <div className="my-2">
              <p className="text-md font-semibold text-gray-700">
                File Shared With
              </p>

              {sharedFileInfo?.shared_with?.map((user) => (
                <span
                  key={user.user_id}
                  className="flex flex-row items-center my-2"
                >
                  <Avatar
                    src={user.profile_pic}
                    alt="owner pic"
                    variant="rounded"
                    sx={{ width: 24, height: 24, marginRight: 1 }}
                  />
                  <p className="text-sm text-gray-700 font-semibold">
                    {user.first_name} {user.last_name}
                  </p>
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-md font-semibold text-gray-700">File Info</p>
              <p className="text-sm text-gray-400">
                {fileInfo.size} {fileInfo.lastUpdate}
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-4 py-1 mx-2 rounded-md shadow border border-gray-300"
            onClick={closeDialog}
            color="primary"
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FileInfo;
