import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ReadIcon from "../assets/read.svg";
import UnfoldIcon from "../assets/unfold.svg";
import { useDarkMode } from "../context/darkModeContext";
import { useAuth } from "../context/authContext";
import { supabase } from "../helper/supabaseClient";
import Avatar from "@mui/material/Avatar";
import { Skeleton } from "@mui/material";

const AccountFiles = () => {
  const { darkMode } = useDarkMode();
  const { formatFileSize } = useAuth();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // useEffect(() => {
  //   const fetchRecentFiles = async () => {
  //     try {
  //       let token = JSON.parse(sessionStorage.getItem("token"));

  //       const recentFilesFromBackend = await axios.get(
  //         "https://twokeybackend.onrender.com/file/files/",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token.session.access_token}`,
  //           },
  //         }
  //       );

  //       console.log(
  //         "recentFilesFromBackend Account files",
  //         recentFilesFromBackend.data
  //       );

  //       if (recentFilesFromBackend) {
  //         const mappedFiles = recentFilesFromBackend.data.map((file) => {
  //           return {
  //             id: file.id,
  //             name: file.name.substring(0, 80),
  //             profilePic: file.profile_pic,
  //             size: formatFileSize(file.metadata.size),
  //             dept: file.dept_name,
  //             owner: file.owner_email,
  //             mimetype: file.metadata.mimetype,
  //             status: "Team",
  //             security: "Enhanced",
  //             lastUpdate: new Date(file.metadata.lastModified).toLocaleString(
  //               "en-IN",
  //               {
  //                 day: "numeric",
  //                 month: "short",
  //                 year: "numeric",
  //                 hour: "numeric",
  //                 minute: "numeric",
  //                 hour12: true,
  //               }
  //             ),
  //           };
  //         });

  //         setFilteredData(mappedFiles);
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching files:", error);
  //     }
  //   };

  //   fetchRecentFiles();
  // }, []);

  useEffect(() => {
    const fetchRecentFiles = async () => {
      try {
        const cacheKey = "accountFilesCache";

        // Check if recent files data is available in localStorage
        const cachedRecentFiles = localStorage.getItem(cacheKey);

        if (cachedRecentFiles) {
          console.log(
            "Using cached account files:",
            JSON.parse(cachedRecentFiles)
          );
          setFilteredData(JSON.parse(cachedRecentFiles));
          setLoading(false);
        }

        let token = JSON.parse(sessionStorage.getItem("token"));

        const recentFilesFromBackend = await axios.get(
          "https://twokeybackend.onrender.com/file/files/?recs=25",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        console.log("Recent files from backend", recentFilesFromBackend.data);

        if (recentFilesFromBackend.data) {
          const mappedFiles = recentFilesFromBackend.data.map((file) => {
            return {
              id: file.id,
              name: file.name.substring(0, 80),
              profilePic: file.profile_pic,
              size: formatFileSize(file.metadata.size),
              dept: file.dept_name,
              owner: file.owner_email,
              mimetype: file.metadata.mimetype,
              status: "Team",
              security: "Enhanced",
              lastUpdate: new Date(file.metadata.lastModified).toLocaleString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }
              ),
            };
          });

          // Replace the cached recent files data with the new data
          localStorage.setItem(cacheKey, JSON.stringify(mappedFiles));

          // Update the state with the new data
          setFilteredData(mappedFiles);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchRecentFiles();
  }, []);

  return (
    <div className={`${darkMode ? "bg-gray-800 text-white" : "text-gray-800"}`}>
      {location.pathname === "/profile" ? (
        ""
      ) : (
        <p className="text-lg text-left font-semibold my-6">Account Files</p>
      )}

      <div>
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F7F9FCCC" }}>
                <TableCell />
                <TableCell>
                  <p className="flex flex-row items-center">
                    FILE NAME <img src={UnfoldIcon} alt="↓" />
                  </p>
                </TableCell>
                <TableCell>OWNER</TableCell>
                <TableCell align="center">
                  STATUS
                  <b className="text-gray-50 text-xs bg-gray-500 rounded-full px-[5px] mx-1">
                    i
                  </b>
                </TableCell>
                <TableCell align="center">SIZE</TableCell>
                <TableCell align="center">
                  SECURITY
                  <b className="text-gray-50 text-xs bg-gray-500 rounded-full px-[5px] mx-1">
                    i
                  </b>
                </TableCell>
                <TableCell align="center">
                  <p className="flex flex-row items-center">
                    LAST UPDATED <img src={UnfoldIcon} alt="↓" />
                  </p>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 10 }).map((_, index) => (
                    <Row key={index} row={null} />
                  ))
                : filteredData.map((row) => <Row key={row.id} row={row} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [Logs, setLogs] = useState([]);

  const getLogs = async (fileId) => {
    try {
      let token = JSON.parse(sessionStorage.getItem("token"));

      const accessLogs = await axios.get(
        `https://twokeybackend.onrender.com/file/getLogs/${fileId}?recs=5`,

        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log(`Access Logs of id ( ${fileId} ) :`, accessLogs.data);

      setLogs(accessLogs.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRowClick = async () => {
    setOpen(!open);
    // Call getLogs only if the row is opened
    if (!open) {
      await getLogs(row.id);
    }
  };

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
    <React.Fragment>
      {!row && (
        <TableRow
          sx={{
            "& > *": { borderBottom: "unset" },
            cursor: "pointer",
          }}
          onClick={handleRowClick}
        >
          <TableCell sx={{ padding: "7px" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          </TableCell>

          <TableCell component="th" scope="row" sx={{ padding: "7px" }}>
            <Skeleton variant="rounded" height={15} />
          </TableCell>
          <TableCell align="center" sx={{ padding: "7px" }}>
            <Skeleton variant="rounded" height={30} width={30} />
          </TableCell>
          <TableCell align="center" sx={{ padding: "7px 20px" }}>
            <Skeleton variant="rounded" height={25} />
          </TableCell>
          <TableCell align="center" sx={{ padding: "7px" }}>
            <Skeleton variant="rounded" height={25} />
          </TableCell>
          <TableCell align="center" sx={{ padding: "7px" }}>
            <Skeleton
              variant="rounded"
              height={25}
              width={100}
              className="mx-auto"
            />
          </TableCell>
          <TableCell align="center">
            <Skeleton
              variant="rounded"
              height={15}
              width={150}
              className="mx-auto"
            />
          </TableCell>
        </TableRow>
      )}
      {row && (
        <TableRow
          sx={{
            "& > *": { borderBottom: "unset" },
            cursor: "pointer",
          }}
          onClick={handleRowClick}
        >
          <TableCell sx={{ padding: "7px" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          </TableCell>

          <TableCell component="th" scope="row" sx={{ padding: "7px" }}>
            <p className="text-indigo-600 font-medium">
              {row.name.slice(0, 15)}
            </p>
          </TableCell>
          <TableCell align="center" sx={{ padding: "7px" }}>
            <Tooltip title={row.owner} arrow>
              <Avatar
                sx={{ width: "30px", height: "30px" }}
                src={row.profilePic}
                alt="Owner"
                variant="rounded"
              />
            </Tooltip>
          </TableCell>
          <TableCell align="center" sx={{ padding: "7px 20px" }}>
            <p className="bg-gray-100 text-gray-800 rounded-md py-1">
              {row.status}
            </p>
          </TableCell>
          <TableCell align="center" sx={{ padding: "7px" }}>
            <p className="bg-gray-100 text-gray-800 rounded-md py-1">
              {row.size}
            </p>
          </TableCell>
          <TableCell align="center" sx={{ padding: "7px" }}>
            <strong className="bg-green-100 text-green-700  rounded-md py-[8px] px-4">
              {row.security}
            </strong>
          </TableCell>
          <TableCell align="center">
            <p className="">{row.lastUpdate}</p>
          </TableCell>
        </TableRow>
      )}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
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
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default AccountFiles;
