import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const MapComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const position = [18.6161, 73.7286];

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="text-sm rounded-md py-[5px] px-3 border border-gray-300 bg-gray-50"
      >
        MapComponent
      </button>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "5px",
          },
        }}
      >
        <DialogTitle sx={{ width: "506px" }}>New Geo - location</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
            margin: 0,
            padding: 0,
          }}
        ></DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-2 py-1 mx-2 rounded-lg shadow-sm border border-gray-300"
            onClick={closeDialog}
            color="primary"
          >
            Cancel
          </button>
          <button className="px-2 py-1 rounded-lg shadow-sm bg-[#5E5ADB] text-white">
            Confirm Location
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MapComponent;
