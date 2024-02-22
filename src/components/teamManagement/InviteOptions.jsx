import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InviteMember from "../InviteMember";
import ImportMember from "./ImportMember";

const InviteOptions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="bg-[#5E5ADB] text-white text-sm rounded-lg py-[5px] px-3"
      >
        Invite a member
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
        <DialogTitle>Invite Member</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2">
            <div className="flex flex-row justify-between items-center gap-4 p-4 py-8">
              <InviteMember close={closeDialog} />
              <ImportMember close={closeDialog} />
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-2 py-1 mx-2 rounded-lg shadow-sm border border-gray-300"
            onClick={closeDialog}
            color="primary"
          >
            Cancel
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InviteOptions;
