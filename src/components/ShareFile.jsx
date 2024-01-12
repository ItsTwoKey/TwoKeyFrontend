import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Link from "../assets/link.svg";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import axios from "axios";
import ProfilePicDummy from "../assets/profilePicDummy.jpg";
import FileIcon from "../assets/fileIcon.svg";
import { useDropzone } from "react-dropzone";
import { supabase } from "../helper/supabaseClient";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";

const ShareFile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let token = JSON.parse(sessionStorage.getItem("token"));
    const listUsers = async () => {
      try {
        const userList = await axios.get(
          "https://twokeybackend.onrender.com/users/list_users/",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log("users :", userList.data);
        setUsers(userList.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (isOpen) {
      listUsers();
    }
  }, [isOpen]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Handle dropped files here
      console.log("Accepted Files:", acceptedFiles);
      setDroppedFiles(acceptedFiles);
    },
  });

  const handleFinalUpload = async () => {
    try {
      for (const file of droppedFiles) {
        const timestamp = Date.now(); // Get current timestamp
        const fileNameWithTimestamp = `${file.name}_TS=${timestamp}`; // Modify file name

        console.log("upload started");
        const { data, error } = await supabase.storage
          .from("TwoKey")
          .upload(fileNameWithTimestamp, file, {
            //   .upload(customFileName || file.name, file, {
            cacheControl: "3600",
            upsert: false,

            onProgress: (event) => {
              const progress = (event.loaded / event.total) * 100;
              console.log(`File uploading... ${progress.toFixed(2)}%`);
            },
          });
        console.log("uploaded file:", data.path);
        handleFileIdRetrieval(data.path);

        if (error) {
          throw new Error("File upload failed");
        }
      }

      showSnackbar("Upload successful", "success");
      setTimeout(() => {
        closeDialog();
      }, 3000);
    } catch (error) {
      console.error("Error occurred in file upload:", error);

      showSnackbar("Upload failed. Please try again.", "error");
      setTimeout(() => {
        closeDialog();
      }, 3000);
    } finally {
      // setProgress(0); // Reset progress after upload is complete
    }
  };

  const handleFileIdRetrieval = async (desiredFileName) => {
    try {
      const { data, error } = await supabase.storage.from("TwoKey").list();

      if (data && data.length > 0) {
        const file = data.find((item) => item.name === desiredFileName);

        if (file) {
          console.log("Object id found:", file.id);
          shareFiles(file.id);
        } else {
          console.log(`Object with name "${desiredFileName}" not found.`);
        }
      } else {
        console.log("No objects found in the 'TwoKey' bucket.");
      }
    } catch (error) {
      console.log("Error occurred while retrieving the file list:", error);
    }
  };

  const shareFiles = async (fileId) => {
    try {
      let token = JSON.parse(sessionStorage.getItem("token"));

      const sharedWithIds = selectedUsers.map((user) => user.id);

      const res = await axios.post(
        "https://twokeybackend.onrender.com/file/shareFile/",
        {
          file: [fileId],
          shared_with: sharedWithIds,
          expiration_time: 315360000,
          security_check: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      console.log("shareFiles:", res);
    } catch (error) {
      console.log("error occurred while setting the permissions", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedUsers([]);
    setDroppedFiles([]);
  };

  const handleRemoveUser = (index) => {
    const updatedUsers = [...selectedUsers];
    updatedUsers.splice(index, 1);

    setSelectedUsers(updatedUsers);
  };

  function formatFileSize(sizeInBytes) {
    const units = ["B", "KB", "MB", "GB"];
    let size = sizeInBytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return size.toFixed(2) + " " + units[unitIndex];
  }

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="text-sm rounded-md py-[5px] px-3 border border-gray-300 bg-white"
      >
        Quick Share
      </button>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>
          <span>
            <h4 className="font-semibold text-md">Quick Share</h4>
            <p className="text-sm">
              Share your project collaborate with your team
            </p>
          </span>
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div className="my-4 w-[486px]">
            <div
              {...getRootProps()}
              className={`dropzone mt-4 h-48 w-full flex items-center justify-center border-2 border-dashed border-blue-500 text-[#2C6ECB] bg-[#F2F7FE] p-4 rounded-md text-center cursor-pointer`}
            >
              <input {...getInputProps()} />
              <p className="text-sm">
                Drag and drop files here, or click to select files
              </p>
            </div>
            {droppedFiles.length > 0 && (
              <div>
                {droppedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center my-2"
                  >
                    <span className="flex flex-row items-center gap-2">
                      <img src={FileIcon} alt="." />
                      <p className="text-sm font-bold">{file.name}</p>
                    </span>
                    <p className="text-sm">{formatFileSize(file.size)}</p>
                  </div>
                ))}
              </div>
            )}
            {/* <div className="py-2">
              <p className="text-[#5E5ADB] underline cursor-pointer" href="#">
                Add more files
              </p>
            </div> */}

            <div className="bg-[#E5E5FF] w-full rounded-lg my-6 py-2 px-4 flex justify-between items-center">
              <span className="flex flex-col gap-1">
                <p className="text-sm font-semibold">
                  Invite members via a sharable link
                </p>
                <p className="text-sm">Anyone with the link can view</p>
              </span>

              <button className="bg-[#5E5ADB] text-white text-md py-2 px-4 rounded-lg flex flex-row items-center gap-1">
                <img src={Link} alt="." />
                Copy Link
              </button>
            </div>

            <div>
              <Select
                multiple
                value={selectedUsers.map((user) => user.id)}
                onChange={(event) => {
                  const selectedUserIds = event.target.value;
                  const selectedUserObjects = users.filter((user) =>
                    selectedUserIds.includes(user.id)
                  );
                  setSelectedUsers(selectedUserObjects);
                  //   console.log("selected Users", selectedUserObjects);
                }}
                displayEmpty
                size="small"
                fullWidth
                renderValue={(selected) => (
                  <div>
                    {selected.map((userId) => {
                      const { name, last_name, profile_pic } = users.find(
                        (user) => user.id === userId
                      );
                      return (
                        <Chip
                          key={userId}
                          avatar={
                            <img
                              src={profile_pic}
                              alt={`${name}'s Profile Pic`}
                              style={{
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                              }}
                            />
                          }
                          label={
                            <div className="flex gap-1">
                              {`${name} ${last_name}`}
                            </div>
                          }
                          className="mx-1"
                        />
                      );
                    })}
                  </div>
                )}
              >
                {/* <MenuItem value="" disabled>
                  <p>Select a user</p>
                </MenuItem> */}
                {users.length > 0 &&
                  users.map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.id}
                      style={{
                        borderRadius: "10px",
                      }}
                    >
                      <span className="flex flex-row items-center gap-3 w-full">
                        <img
                          src={
                            user.profile_pic
                              ? user.profile_pic
                              : ProfilePicDummy
                          }
                          alt="Profile pic"
                          className="h-8 w-8 rounded-full"
                        />
                        <span>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs font-light text-gray-500">
                            {user.email}
                          </p>
                        </span>
                      </span>
                    </MenuItem>
                  ))}
              </Select>
              {selectedUsers &&
                selectedUsers.map((user, index) => (
                  <span
                    key={user.id}
                    className="flex flex-row gap-2 items-center my-2 w-fit rounded-full bg-white py-1 px-2 border"
                  >
                    <img
                      src={
                        user.profile_pic ? user.profile_pic : ProfilePicDummy
                      }
                      alt="Profile pic"
                      className="h-6 w-6 rounded-full"
                    />
                    <p className="text-sm font-semibold">
                      {user.name} {user.last_name}
                    </p>
                    <button
                      onClick={() => handleRemoveUser(index)}
                      className="h-4 w-4 text-xs"
                    >
                      ⨉
                    </button>
                  </span>
                ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <div className="flex justify-between w-full px-2">
            <button
              className="px-3 py-1.5 rounded-lg shadow-sm border border-gray-300 text-sm font-semibold"
              onClick={closeDialog}
              color="primary"
            >
              Cancel
            </button>
            <button
              className="px-3 py-1.5 rounded-lg shadow-sm border border-[#5E5ADB] text-[#5E5ADB] text-sm font-semibold"
              onClick={handleFinalUpload}
            >
              Done
            </button>
          </div>
        </DialogActions>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Dialog>
    </div>
  );
};

export default ShareFile;
