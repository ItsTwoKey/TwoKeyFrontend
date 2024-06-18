import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { debounce } from "lodash";
import toast, { Toaster } from "react-hot-toast";

const AddFilesInsideFolder = ({ folderId, listFilesInFolder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileId, setFileId] = useState("");
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    getOwnedFiles();
  }, []);

  const getOwnedFiles = async () => {
    let token = secureLocalStorage.getItem("token");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files?type=owned`,

        {
          headers: {
            Authorization: token,
          },
        }
      );

      setFiles(response.data);
      console.log("files", response.data);
    } catch (error) {
      console.log("error occurred while fetching folder.", error);
    }
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setFileId("");
    setSearchTerm("");
    setSelectedFileName("");
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  const handleFileClick = (fileId, fileName) => {
    setFileId(fileId);
    setSelectedFileName(fileName);
  };

  const addFile = async () => {
    let token = secureLocalStorage.getItem("token");
    let body = { file_id: fileId, idToken: token };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/folder/addFile/${folderId}`,
        body,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response) {
        toast.success("File added successfully.");
        setFileId("");
        listFilesInFolder(folderId);
        closeDialog();
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
        <DialogTitle>Add File</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] p-3">
            <p className="py-2">File Name :</p>
            <FormControl fullWidth>
              <TextField
                label="Search File"
                variant="outlined"
                onChange={(e) => handleSearch(e.target.value)}
                size="small"
                fullWidth
              />
            </FormControl>

            <React.Fragment>
              {selectedFileName && (
                <p className="py-2 my-2">
                  Selected File:{" "}
                  <span className="font-semibold">
                    {selectedFileName.split("_TS=")[0]}
                  </span>
                </p>
              )}

              <div className="my-2">
                {!selectedFileName &&
                  files
                    .filter((file) =>
                      file.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((file) => (
                      <MenuItem
                        className="menu-item"
                        key={file.id}
                        onClick={() => handleFileClick(file.id, file.name)}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = file.color)
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "inherit")
                        }
                      >
                        <p>{file.name.split("_TS=")[0]}</p>
                      </MenuItem>
                    ))}
              </div>
            </React.Fragment>
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
            disabled={!fileId}
          >
            Add file
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFilesInsideFolder;
