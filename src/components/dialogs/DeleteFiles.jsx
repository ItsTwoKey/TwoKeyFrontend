import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DeleteMultiFilesConfirmation from "./DeleteMultiFilesConfirmation";

function DeleteFiles({ isOpen, closeDialog, removeMultiSelect, removeFiles }) {
  const [openConfirmation, setOpenConfirmation] = useState(false);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "5px",
            maxWidth: "80%",
            width: "auto",
            maxHeight: "80%",
          },
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent
          style={{
            backgroundColor: "white",
          }}
        >
          <div className="my-2 p-3 flex flex-col justify-center items-center gap-6">
            <div className="flex flex-col">
              <button
                className="py-1 px-4 rounded-md border bg-[#D1293D] text-white my-4"
                // onClick={() => setSelect(!select)}
              >
                Move Files to Recycle Bin
              </button>
              <button
                className="py-1 px-4 rounded-md border bg-[#D1293D] text-white"
                onClick={() => {
                  setOpenConfirmation(true);
                }}
              >
                Delete Files Permanently
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {openConfirmation && (
        <DeleteMultiFilesConfirmation
          isOpen={openConfirmation}
          closeDialog={() => setOpenConfirmation(false)}
          closeDeleteDialog={closeDialog}
          removeMultiSelect={removeMultiSelect}
          removeFiles={removeFiles}
        />
      )}
    </div>
  );
}

export default DeleteFiles;
