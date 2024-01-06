import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
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
import Avatar from "@mui/material/Avatar";
import { Skeleton } from "@mui/material";
import FileView from "./FileView";

const DashboardFiles = () => {
  const { darkMode } = useDarkMode();
  const { formatFileSize } = useAuth();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("name");
  const location = useLocation();
  const [isFileViewOpen, setIsFileViewOpen] = useState(false);
  const [selectedFileInfo, setSelectedFileInfo] = useState({
    name: "",
    size: "",
    id: "",
    owner: "",
    profileUrl: "",
    lastUpdate: "",
  });
  const [sharedFileInfo, setSharedFileInfo] = useState({});

  useEffect(() => {
    const cacheKey = "accountFilesCache";

    // Check if account files data is available in localStorage
    const cachedAccountFiles = localStorage.getItem(cacheKey);

    if (cachedAccountFiles) {
      console.log(
        "Using cached account files:",
        JSON.parse(cachedAccountFiles)
      );
      setFilteredData(JSON.parse(cachedAccountFiles));
      setLoading(false);
    }

    const fetchAccountFiles = async () => {
      try {
        let token = JSON.parse(sessionStorage.getItem("token"));

        const accountFilesFromBackend = await axios.get(
          "https://twokeybackend.onrender.com/file/files/?recs=25",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        console.log("Account files from backend", accountFilesFromBackend.data);

        if (accountFilesFromBackend.data) {
          const mappedFiles = accountFilesFromBackend.data.map((file) => {
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

          // Replace the cached account files data with the new data
          localStorage.setItem(cacheKey, JSON.stringify(mappedFiles));

          // Update the state with the new data
          setFilteredData(mappedFiles);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchAccountFiles();
  }, []);

  const handleSort = (column) => {
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
    setSortColumn(column);
  };

  const getSharedFileInfo = async (fileId) => {
    try {
      let token = JSON.parse(sessionStorage.getItem("token"));
      const info = await axios.get(
        `https://twokeybackend.onrender.com/file/sharedFileInfo/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      setSharedFileInfo(info.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openDrawer = (
    fileName,
    fileSize,
    fileId,
    owner,
    profilePic,
    lastUpdate
  ) => {
    getSharedFileInfo(fileId);
    setSelectedFileInfo({
      name: fileName,
      size: fileSize,
      id: fileId,
      owner: owner,
      ownerProfileUrl: profilePic,
      lastUpdate: lastUpdate,
    });
    setIsFileViewOpen(true);
  };

  const closeDrawer = () => {
    setIsFileViewOpen(false);
  };

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
                  <p
                    className="flex flex-row items-center"
                    onClick={() => handleSort("name")}
                  >
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
                <TableCell align="center" onClick={() => handleSort("size")}>
                  SIZE
                  <b className="text-gray-50 text-xs bg-gray-500 rounded-full px-[5px] mx-1">
                    i
                  </b>
                </TableCell>
                <TableCell align="center">
                  SECURITY
                  <b className="text-gray-50 text-xs bg-gray-500 rounded-full px-[5px] mx-1">
                    i
                  </b>
                </TableCell>
                <TableCell
                  align="center"
                  onClick={() => handleSort("lastUpdate")}
                >
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
                : filteredData
                    .slice()
                    .sort((a, b) => {
                      if (sortColumn === "lastUpdate") {
                        return sortOrder === "asc"
                          ? new Date(a.lastUpdate) - new Date(b.lastUpdate)
                          : new Date(b.lastUpdate) - new Date(a.lastUpdate);
                      } else if (sortColumn === "name") {
                        return sortOrder === "asc"
                          ? a.name.localeCompare(b.name)
                          : b.name.localeCompare(a.name);
                      } else if (sortColumn === "size") {
                        return sortOrder === "asc"
                          ? a.size - b.size
                          : b.size - a.size;
                      }
                      // Add similar sorting logic for other columns as needed

                      return 0;
                    })
                    .map((row) => (
                      <Row key={row.id} row={row} openDrawer={openDrawer} />
                    ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {isFileViewOpen && (
        <FileView
          fileInfo={selectedFileInfo}
          closeDrawer={closeDrawer}
          sharedFileInfo={sharedFileInfo}
        />
      )}
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
            <p
              className="text-indigo-600 font-medium"
              onClick={() =>
                props.openDrawer(
                  row.name,
                  row.size,
                  row.id,
                  row.owner,
                  row.profilePic,
                  row.lastUpdate
                )
              }
            >
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

export default DashboardFiles;
