import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Avatar from "@mui/material/Avatar";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ReadIcon from "../assets/read.svg";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const FileInfo = ({ fileInfo, closeDrawer, sharedFileInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [Logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    openDialog();
    getLogs();
  }, []);

  const getLogs = async () => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));

      const accessLogs = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/getLogs/${fileInfo.id}?recs=5`,

        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log(`Access Logs of id ( ${fileInfo.id} ) :`, accessLogs.data);

      setLogs(accessLogs.data);
      setLoading(false); // Set loading to false after logs are fetched
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    closeDrawer();
  };

  // console.log(sharedFileInfo);
  // console.log(fileInfo);

  const formatTimestamp = (timestamp) => {
    const options = {
      timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return new Date(timestamp).toLocaleString("en-IN", options);
  };

  return (
    <div className="">
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "5px",
          },
        }}
      >
        <DialogTitle>{fileInfo.name.split("_TS=")[0]}</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] p-3">
            <div className="mb-2">
              <p className="text-md font-semibold text-gray-700 mb-1">
                File Description
              </p>
              <p className="text-sm text-[#1C1C1CB2]">
                Manager can do everything, including managin users and deleting
                current administrators.
              </p>
            </div>

            <div className="my-2">
              <p className="text-md font-semibold text-gray-700">
                File Shared With
              </p>

              {sharedFileInfo?.shared_with?.map((user) => (
                <span
                  key={user.user_id}
                  className="flex flex-row items-center my-2"
                >
                  <Avatar
                    src={user.profile_pic}
                    alt="owner pic"
                    variant="rounded"
                    sx={{ width: 24, height: 24, marginRight: 1 }}
                  />
                  <p className="text-sm text-gray-700 font-semibold">
                    {user.first_name} {user.last_name}
                  </p>
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-md font-semibold text-gray-700">File Info</p>
              <p className="text-sm text-gray-400">
                {fileInfo.size} {fileInfo.lastUpdate}
              </p>
            </div>

            <div className="my-2">
              {loading ? (
                <p className="text-center">loading...</p>
              ) : (
                <Stepper activeStep={Logs.length - 1} orientation="vertical">
                  {Logs.length > 0 ? (
                    Logs.map((log, index) => (
                      <Step key={index}>
                        <StepLabel
                          icon={
                            <img
                              src={ReadIcon}
                              alt="read"
                              className="bg-indigo-300 rounded-full p-0.5"
                            />
                          }
                        >
                          <div>
                            <p className="text-sm tracking-wide space-x-1">
                              <strong>{log.username}</strong>{" "}
                              <span className="text-gray-600">
                                {log.event === "screenshot"
                                  ? "Took Screenshot of"
                                  : "accessed"}
                              </span>{" "}
                              <span className="text-indigo-500 ">file</span>
                              <span className="text-gray-400">
                                on {formatTimestamp(log.timestamp)}
                              </span>
                            </p>
                          </div>
                        </StepLabel>
                      </Step>
                    ))
                  ) : (
                    <Step key={0}>
                      <StepLabel icon={<p>.</p>}>
                        <p className="text-center">No logs found!</p>
                      </StepLabel>
                    </Step>
                  )}
                </Stepper>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-4 py-1 mx-2 rounded-md shadow border border-gray-300"
            onClick={closeDialog}
            color="primary"
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FileInfo;
