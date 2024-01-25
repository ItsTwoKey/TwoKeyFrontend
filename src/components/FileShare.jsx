import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SecurityAllocation from "./SecurityAllocation";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const FileShare = ({ menuFile, hideMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState({
    geoLocation: false,
    uniqueIdentifiers: false,
    accessControl: false,
  });
  const [securityAllotmentData, setSecurityAllotmentData] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    hideMenu();
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

  const shareFile = async () => {
    try {
      let token = JSON.parse(sessionStorage.getItem("token"));

      const res = await axios.post(
        "https://twokeybackend.onrender.com/file/shareFile/",
        {
          file: [menuFile.id],
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

      // Show snackbar on successful file sharing
      showSnackbar("File shared successfully", "success");

      setTimeout(() => {
        closeDialog();
        hideMenu();
      }, 2000);
    } catch (error) {
      console.log("error occurred while setting the permissions", error);

      // Show snackbar on error
      showSnackbar("Error sharing file", "error");
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

  return (
    <div className="">
      <button onClick={openDialog} className="">
        Share
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
        <DialogTitle>Share File</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] p-3">
            <span className="flex flex-row gap-1 items-center">
              <p className="font-semibold">File name:</p>
              <p className="font-semibold text-sm text-gray-600">
                {menuFile.name.split("_TS=")[0]}
              </p>
            </span>

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

            <SecurityAllocation
              handleSecurityAllocation={handleSecurityAllocation}
              isOpen={isOpen}
              checkboxValues={checkboxValues}
            />

            {snackbarOpen && (
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
            className={`px-4 py-1 rounded-lg shadow-sm text-white bg-[#5E5ADB] hover:bg-blue-500`}
            onClick={shareFile}
          >
            Share
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FileShare;
