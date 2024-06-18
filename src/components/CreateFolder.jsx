import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import Chrome from "@uiw/react-color-chrome";
import { GithubPlacement } from "@uiw/react-color-github";
import { CircularProgress } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

const CreateFolder = ({ listFolders }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [hex, setHex] = useState("#EFEEDC");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    let token = secureLocalStorage.getItem("token");
    let body = {
      name: folderName,
      metadata: {
        bg: hex,
        border: "#B7B6C2",
      },
      idToken: token,
    }; // Use folderName from state

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/folder`,
        body,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response) {
        setFolderName(""); // Clear folderName after folder is created
        setHex("#EFEEDC"); // Reset hex color after folder is created

        toast.success("Folder created successfully.");

        closeDialog();
        listFolders();
      }
    } catch (error) {
      console.log("error occurred while creating folder.", error);
      toast.error("Error occurred while creating folder.");
    } finally {
      setLoading(false); // Set loading to false after the operation is completed
    }
  };

  return (
    <div className="">
      <Toaster position="bottom-left" reverseOrder={false} />
      <button
        onClick={openDialog}
        title="create folder"
        className="text-2xl rounded-lg px-3 mx-4 text-center text-purple-600 border border-purple-600"
      >
        +
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

            <span>
              <p className="text-gray-700 my-2">Folder Color</p>
              <Chrome
                color={hex}
                style={{ width: "100%", margin: "auto" }}
                placement={GithubPlacement.Right}
                onChange={(color) => {
                  setHex(color.hexa);
                }}
              />
            </span>
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
            className={`flex items-center gap-2 justify-center px-2 py-1 rounded-lg shadow-sm bg-[#5E5ADB] text-white ${
              loading ? "cursor-not-allowed opacity-40" : "cursor-pointer"
            }`}
            onClick={createFolder}
            disabled={!folderName || loading} // Disable button if folderName is empty
          >
            Create Folder
            {loading && <CircularProgress size={20} color="inherit" />}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateFolder;
