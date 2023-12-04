import React, { useState, useEffect } from "react";
import FileViewer from "./FileViewer";
import FileDetails from "./FileDetails";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

const FileView = ({ fileInfo, closeDrawer, sharedFileInfo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    closeDrawer();
  };

  useEffect(() => {
    openDialog();
  }, []);

  return (
    <div className="">
      <Dialog open={isOpen} onClose={closeDialog} fullScreen>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
            margin: 0,
            padding: 0,
          }}
        >
          <div className="flex">
            <div className="w-4/5">
              <FileViewer />
            </div>
            <div className="w-1/5">
              <FileDetails
                fileInfo={fileInfo}
                sharedFileInfo={sharedFileInfo}
                closeDrawer={closeDrawer}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileView;
