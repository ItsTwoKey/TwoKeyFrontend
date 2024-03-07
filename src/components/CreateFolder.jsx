import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const CreateFolder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  const createFolder = async () => {
    let token = JSON.parse(secureLocalStorage.getItem("token"));
    let body = { name: folderName }; // Use folderName from state
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/folder`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log("created folder", response.data);

      if (response) {
        closeDialog();
      }
    } catch (error) {
      console.log("error occurred while creating folder.", error);
    }
  };

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="text-md rounded-lg py-1 px-4 bg-purple-600 text-white"
      >
        Create Folder
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
        <DialogTitle>Create Folder</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] p-3">
            <p className="py-2">Folder Name :</p>
            <TextField
              //   label="Folder Name"
              variant="outlined"
              value={folderName}
              onChange={handleFolderNameChange}
              size="small"
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-2 py-1 mx-2 rounded-lg shadow-sm border border-gray-300"
            onClick={closeDialog}
            color="primary"
          >
            Close
          </button>
          <button
            className="px-2 py-1 rounded-lg shadow-sm bg-[#5E5ADB] text-white"
            onClick={createFolder}
            disabled={!folderName} // Disable button if folderName is empty
          >
            Create Folder
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateFolder;
