import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import LinearProgress from "@mui/material/LinearProgress"; // Import LinearProgress
import axios from "axios";
import SecurityAllocation from "./SecurityAllocation";
import { supabase } from "../helper/supabaseClient";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function QuickShareSelectSecurityLevel({
  open,
  selectedUsers,
  onClose,
  droppedFiles,
  handleRemoveFile,
  customFileName,
}) {
  const [alignment, setAlignment] = useState("low");
  const [securityAllotmentData, setSecurityAllotmentData] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [progress, setProgress] = useState(0); // New state for progress

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    console.log(newAlignment);
  };

  const handleProgress = (event) => {
    const percentage = (event.loaded / event.total) * 100;
    setProgress(percentage);
  };

  // const handleFinalUpload = async () => {
  //   try {
  //     for (const file of droppedFiles) {
  //       const { data, error } = await supabase.storage
  //         .from("TwoKey")
  //         .upload(customFileName || file.name, file, {
  //           cacheControl: "3600",
  //           upsert: false,
  //           onProgress: handleProgress,
  //         });
  //       console.log("uploaded file:", data.path);
  //       handleFileIdRetrieval(data.path);

  //       if (error) {
  //         throw new Error("File upload failed");
  //       }
  //     }

  //     showSnackbar("Upload successful", "success");
  //     setTimeout(() => {
  //       onClose();
  //     }, 3000);
  //   } catch (error) {
  //     console.error("Error occurred in file upload:", error);

  //     showSnackbar("Upload failed. Please try again.", "error");
  //     setTimeout(() => {
  //       onClose();
  //     }, 3000);
  //   } finally {
  //     setProgress(0); // Reset progress after upload is complete
  //   }
  // };

  const handleFinalUpload = async () => {
    try {
      for (const file of droppedFiles) {
        console.log("upload started");
        const { data, error } = await supabase.storage
          .from("TwoKey")
          .upload(customFileName || file.name, file, {
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
      // setTimeout(() => {
      //   onClose();
      // }, 3000);
    } catch (error) {
      console.error("Error occurred in file upload:", error);

      showSnackbar("Upload failed. Please try again.", "error");
      // setTimeout(() => {
      //   onClose();
      // }, 3000);
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

  function handleSecurityAllocation(data) {
    setSecurityAllotmentData(data);
    console.log("handleSecurityAllocation", data);
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "15px",
        },
      }}
    >
      <DialogTitle>Quick Search</DialogTitle>
      <DialogContent className="bg-gray-100">
        <div className="w-80 py-4">
          <ul className="my-2">
            {droppedFiles.map((file, index) => (
              <li
                key={file.name}
                className="text-xs bg-white border border-gray-200 border-b-2 border-b-green-600 rounded-sm py-1 px-4 mb-1 flex items-center justify-between "
              >
                <span>{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-white bg-gray-200 rounded-full h-4 w-4 text-xs hover:text-gray-700 focus:outline-none"
                >
                  X
                </button>
              </li>
            ))}
          </ul>

          <span className="my-4">
            {" "}
            <p className="text-gray-600 text-sm font-semibold">
              Security Level
            </p>
            <ToggleButtonGroup
              value={alignment}
              exclusive
              onChange={handleAlignment}
              size="small"
              className=" bg-slate-200 my-2 border-none"
              style={{ border: "none" }}
            >
              <ToggleButton value="low">
                <p className="capitalize">low</p>
              </ToggleButton>
              <ToggleButton value="moderate">
                <p className="capitalize">moderate</p>
              </ToggleButton>
              <ToggleButton value="enhanced">
                <p className="capitalize">enhanced</p>
              </ToggleButton>
              <ToggleButton value="high">
                <p className="capitalize">high</p>
              </ToggleButton>
              <ToggleButton value="maximum">
                <p className="capitalize">maximum</p>
              </ToggleButton>
            </ToggleButtonGroup>
          </span>

          <div className="flex flex-row justify-start items-center gap-4 text-sm my-2">
            <p className="bg-white px-2 py-1 rounded-lg border">All</p>
            <p>Editors</p>
            <p>Viewers</p>
            <p>Download</p>
          </div>

          <SecurityAllocation
            handleSecurityAllocation={handleSecurityAllocation}
            selectedUsers={selectedUsers}
          />
        </div>
        {/* <div>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ width: "100%", marginBottom: 2 }}
          />
          <p>{Math.round(progress)}% Complete</p>
        </div> */}
      </DialogContent>
      <DialogActions style={{ margin: "5px" }}>
        <button
          onClick={onClose}
          className="text-black border border-gray-300 py-1 px-3 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleFinalUpload}
          // onClick={() => console.log(securityAllotmentData)}
          //   onClick={shareFiles}
          //   onClick={handleFileIdRetrieval}
          className="bg-blue-700 text-white py-1 px-3 rounded-lg"
        >
          Upload
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
  );
}
