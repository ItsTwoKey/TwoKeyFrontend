import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/authContext";
import ProfilePicDummy from "../assets/profilePicDummy.jpg";
import { supabase } from "../helper/supabaseClient";
import SecurityAllocation from "./SecurityAllocation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const SecureShare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { listLocations } = useAuth();
  const [checkboxValues, setCheckboxValues] = useState({
    geoLocation: false,
    uniqueIdentifiers: false,
    accessControl: false,
  });
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [securityAllotmentData, setSecurityAllotmentData] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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
      listLocations();
      listUsers();
    }
  }, [isOpen]);

  const handleFinalUpload = async () => {
    try {
      for (const file of selectedFiles) {
        console.log("upload started");
        const { data, error } = await supabase.storage
          .from("TwoKey")
          .upload(file.name, file, {
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

      //   console.log("shareFiles Id:", fileId);
      const res = await axios.post(
        "https://twokeybackend.onrender.com/file/shareFile/",
        {
          file: [fileId],
          shared_with: [securityAllotmentData[0].user],
          expiration_time: securityAllotmentData[0].timeDifference,
          security_check: {
            download_enabled: true,
            geo_enabled: securityAllotmentData[0].location,
          },
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

  const handleRemoveFile = (fileIndex) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(fileIndex, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleCheckboxChange = (checkbox) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [checkbox]: !prevValues[checkbox],
    }));
  };

  function handleSecurityAllocation(data) {
    setSecurityAllotmentData(data);
    console.log("handleSecurityAllocation", data);
  }

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setSelectedFiles([]);
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Update the selected files array
    setSelectedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const addUserToSelectedUsers = (user) => {
    const updatedUsers = [...selectedUsers, user];
    setSelectedUsers(updatedUsers);
  };

  const handleRemoveUser = (index) => {
    const updatedUsers = [...selectedUsers];
    updatedUsers.splice(index, 1);
    setSelectedUsers(updatedUsers);
  };

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="py-1 px-4 rounded-md border bg-blue-700 text-white"
      >
        Secure Share
      </button>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            borderRadius: "5px",
          },
        }}
      >
        {/* <DialogTitle>Secure Share</DialogTitle> */}
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="flex flex-row gap-4">
            <div className="">
              <div
                {...getRootProps()}
                className={`dropzone mt-2 h-[320px] w-[400px] flex items-center justify-center border-2 border-dashed border-blue-500 text-[#2C6ECB] bg-[#F2F7FE] p-4 rounded-md text-center cursor-pointer`}
              >
                <input {...getInputProps()} />
                <p className="text-sm">
                  Drag and drop files here, or click to select files
                </p>
              </div>
              {selectedFiles.length > 0 && (
                <div>
                  <p className="text-black text-sm font-semibold py-2 mb-2">
                    Uploading - {selectedFiles.length}{" "}
                    {selectedFiles.length === 1 ? "file" : "files"}
                  </p>
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li
                        key={file.name}
                        className="text-xs border-b-2 border-b-green-600 rounded-sm py-2 px-4 mb-1 flex items-center justify-between"
                      >
                        <span>{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-xl rounded-full h-4 w-4 hover:text-gray-700 focus:outline-none"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="w-[400px]">
              <div>
                <p className="text-gray-600 font-semibold my-1">
                  Security Features
                </p>
                <span className="grid grid-cols-2 text-gray-800 font-semibold">
                  <label>
                    <input
                      type="checkbox"
                      checked={checkboxValues.uniqueIdentifiers}
                      className="mx-1"
                      onChange={() => handleCheckboxChange("uniqueIdentifiers")}
                    />
                    Unique Identifiers
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={checkboxValues.geoLocation}
                      className="mx-1"
                      onChange={() => handleCheckboxChange("geoLocation")}
                    />
                    Geo - Location
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={checkboxValues.accessControl}
                      className="mx-1"
                      onChange={() => handleCheckboxChange("accessControl")}
                    />
                    Access Control and Authorization
                  </label>
                </span>
              </div>

              <div className="my-2">
                <p className="text-gray-600 font-semibold my-1">Receiver</p>

                <Select
                  multiple
                  value={selectedUsers.map((user) => user.id)}
                  onChange={(event) => {
                    const selectedUserIds = event.target.value;
                    const selectedUserObjects = users.filter((user) =>
                      selectedUserIds.includes(user.id)
                    );
                    setSelectedUsers(selectedUserObjects);
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
                  <MenuItem value="" disabled>
                    <p>Select a user</p>
                  </MenuItem>
                  {users.length > 0 &&
                    users.map((user) => (
                      <MenuItem
                        key={user.id}
                        value={user.id}
                        style={{
                          borderRadius: "10px",
                        }}
                      >
                        <span className="flex justify-between items-center w-full">
                          <span className="flex flex-row items-center gap-2">
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
                              <p className="text-sm font-semibold">
                                {user.name}
                              </p>
                              <p className="text-xs font-light text-gray-500">
                                {user.email}
                              </p>
                            </span>
                          </span>
                          <p className="text-sm font-semibold">Invite › </p>
                        </span>
                      </MenuItem>
                    ))}
                </Select>

                <div className="my-4">
                  <SecurityAllocation
                    handleSecurityAllocation={handleSecurityAllocation}
                    selectedUsers={selectedUsers}
                    checkboxValues={checkboxValues}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px", backgroundColor: "#F7F8FA" }}>
          <button
            className="px-4 py-1 mx-2 rounded-lg shadow-sm border bg-[#D1293D] text-white"
            onClick={closeDialog}
            color="primary"
          >
            Discard
          </button>
          <button
            className="px-4 py-1 rounded-lg shadow-sm bg-[#5E5ADB] text-white"
            onClick={handleFinalUpload}
          >
            Share
          </button>
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

export default SecureShare;
