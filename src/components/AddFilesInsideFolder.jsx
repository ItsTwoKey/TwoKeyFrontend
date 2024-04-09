import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import toast, { Toaster } from "react-hot-toast";

const AddFilesInsideFolder = ({ folderId, listFilesInFolder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileId, setFileId] = useState("");
  const [files, setFiles] = useState([]);

  const handleChange = (event) => {
    setFileId(event.target.value);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const files = secureLocalStorage.getItem("recentFilesCache");
    setFiles(JSON.parse(files));
    // console.log(JSON.parse(files));
  }, []);

  const addFile = async () => {
    let token = JSON.parse(secureLocalStorage.getItem("token"));
    let body = { file_id: fileId }; // Use folderName from state
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/folder/addFile/${folderId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      //   console.log("created folder", response.data);
      toast.success("File added successfully.");

      if (response) {
        closeDialog();
        setFileId("");
        listFilesInFolder(folderId);
      }
    } catch (error) {
      console.log("error occurred while creating folder.", error);
      toast.error("Error adding the file.");
    }
  };

  return (
    <div className="">
      <Toaster position="bottom-left" reverseOrder={false} />
      <button
        onClick={openDialog}
        title="create folder"
        className="text-lg rounded-lg px-2 mx-4 text-center bg-purple-600 border border-purple-600 text-white"
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
        <DialogTitle>Add File</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] p-3">
            <p className="py-2">File Name :</p>
            {/* <TextField
              //   label="Folder Name"
              variant="outlined"
              value={folderName}
              onChange={handleFolderNameChange}
              size="small"
              fullWidth
            /> */}

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">files</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fileId}
                label="files"
                onChange={handleChange}
              >
                <MenuItem value={0}>Select File</MenuItem>
                {files &&
                  files.map((file) => (
                    <MenuItem key={file.id} value={file.id}>
                      <p className="line-clamp-1 w-96">
                        {" "}
                        {file.name.split("_TS=")[0]}
                      </p>
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
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
            onClick={addFile}
            disabled={!fileId} // Disable button if folderName is empty
          >
            Add file
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFilesInsideFolder;
