import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useDropzone } from "react-dropzone";
import { supabase } from "../helper/supabaseClient";
import SecurityAllocation from "./SecurityAllocation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import * as tus from "tus-js-client";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "green" : "green",
  },
}));

const SecureShare = () => {
  const projectId = process.env.REACT_APP_SUPABASE_PROJECT_REF;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({
    geoLocation: false,
    uniqueIdentifiers: false,
    accessControl: false,
  });
  const [expanded, setExpanded] = useState(null);
  const [securityAllotmentData, setSecurityAllotmentData] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (bucketName, fileName, file, index) => {
    try {
      let token = JSON.parse(sessionStorage.getItem("token"));

      const upload = new tus.Upload(file, {
        endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${token.session.access_token}`,
          "x-upsert": "true",
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: bucketName,
          objectName: fileName,
          contentType: file.type,
          cacheControl: 3600,
        },
        chunkSize: 6 * 1024 * 1024,
        onError: function (error) {
          console.error("Failed because:", error);
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setUploadProgress(Number(percentage));
        },
        onSuccess: function () {
          console.log(`Download ${upload.file.name} from ${upload.url}`);
          closeDialog();
          handleFileIdRetrieval(fileName);
        },
      });

      // Check if there are any previous uploads to continue.
      const previousUploads = await upload.findPreviousUploads();
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      upload.start();
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  const handleFinalUpload = async () => {
    try {
      for (const file of selectedFiles) {
        const timestamp = Date.now(); // Get current timestamp
        const fileNameWithTimestamp = `${file.name}_TS=${timestamp}`; // Modify file name

        console.log("upload started");
        await uploadFile("TwoKey", fileNameWithTimestamp, file);
        console.log("uploaded file:", fileNameWithTimestamp);
        // handleFileIdRetrieval(fileNameWithTimestamp);
      }

      // Show success snackbar after successful file upload

      showSnackbar("Upload successful", "success");
    } catch (error) {
      console.error("Error occurred in file upload:", error);
      showSnackbar("Upload failed. Please try again.", "error");
    } finally {
      setUploadProgress(0); // Reset progress after upload is complete
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
          shared_with: securityAllotmentData.selectedUsers,
          expiration_time: securityAllotmentData.timeDifference,
          security_check: {
            download_enabled: true,
            geo_enabled: securityAllotmentData.location,
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
    setUploadProgress(0);
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Update the selected files array
    setSelectedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="py-1 px-4 rounded-md border bg-blue-700 hover:bg-blue-500 text-white"
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
                <SecurityAllocation
                  handleSecurityAllocation={handleSecurityAllocation}
                  isOpen={isOpen}
                  checkboxValues={checkboxValues}
                />
              </div>
              {uploadProgress > 0 && (
                <BorderLinearProgress
                  variant="determinate"
                  value={uploadProgress}
                />
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px", backgroundColor: "#F7F8FA" }}>
          <button
            className="px-4 py-1 mx-2 rounded-lg shadow-sm border bg-[#D1293D] hover:bg-red-500 text-white"
            onClick={closeDialog}
            color="primary"
          >
            Discard
          </button>
          <button
            className={`px-4 py-1 rounded-lg shadow-sm text-white ${
              selectedFiles.length
                ? "bg-[#5E5ADB] hover:bg-blue-500"
                : "bg-gray-400"
            } `}
            onClick={handleFinalUpload}
            disabled={!selectedFiles.length}
          >
            Share
          </button>
        </DialogActions>

        {uploadProgress > 90 && (
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
        )}
      </Dialog>
    </div>
  );
};

export default SecureShare;
