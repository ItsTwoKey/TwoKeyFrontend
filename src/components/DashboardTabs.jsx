import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DashboardFiles from "../components/DashboardFiles";
import ProfileLogs from "../components/ProfileLogs";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import RecentFiles from "./RecentFiles";
import { useAuth } from "../context/authContext";
import UploadFile from "./UploadFile";
import SecureShare from "./SecureShare";
import { useDarkMode } from "../context/darkModeContext";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ProfileTabs() {
  const { formatFileSize } = useAuth();
  const { darkMode } = useDarkMode();
  const [value, setValue] = useState("all");
  const [files, setFiles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTabChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let token = JSON.parse(secureLocalStorage.getItem("token"));
        let url;

        // Determine the URL based on the selected tab
        switch (value) {
          case "all":
            url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files/?recs=25`;
            break;
          case "shared":
            url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files?type=shared`;
            break;
          case "received":
            url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files?type=received`;
            break;
          case "owned":
            url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files?type=owned`;
            break;

          default:
            url = "";
            break;
        }

        // Check if the URL is empty before making the request
        if (url) {
          const getFiles = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          });

          console.log(`dashboard Tabs`, getFiles.data);
          setFiles(getFiles.data);

          const cacheKey = "recentFilesCache";

          // Check if recent files data is available in localStorage
          const cachedRecentFiles = secureLocalStorage.getItem(cacheKey);

          if (cachedRecentFiles) {
            // console.log(
            //   "Using cached recent files:",
            //   JSON.parse(cachedRecentFiles)
            // );
            setFilteredData(JSON.parse(cachedRecentFiles));
            setLoading(false);
          }

          if (getFiles) {
            const mappedFiles = getFiles.data.map((file) => {
              // destucture and extract dept name of every file
              try {
                const [{ depts }, ...extra] = file.file_info;
                const [{ name }, ...more] = depts;
                file.department = name;
              } catch (err) {
                // if department {depts:[]} is empty
                // console.log(err);
                file.department = "";
              }
              // console.log("department : ", file.department);

              return {
                id: file.id,
                name: file.name.substring(0, 80),
                profilePic: file.profile_pic,
                size: formatFileSize(file.metadata.size),
                dept: file.department,
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
            secureLocalStorage.setItem(cacheKey, JSON.stringify(mappedFiles));

            // Update the state with the new data
            setFilteredData(mappedFiles);
            setLoading(false);
          }
        } else {
          console.log("URL is empty. Skipping request.");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLogs();
  }, [value]);

  return (
    <div className="py-4">
      <div
        className={`flex flex-row justify-between items-center ${
          darkMode && "text-gray-200"
        }`}
      >
        <p className="text-2xl font-semibold ">Files</p>
        <span className="flex gap-2">
          <SecureShare />
          <UploadFile />
          {/* <ShareFile /> */}
        </span>
      </div>

      <Box sx={{ width: "100%" }}>
        <div className="w-32 py-4">
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={value}
            label=""
            onChange={handleTabChange}
            fullWidth
            size="small"
          >
            <MenuItem value={"all"}>All</MenuItem>
            <MenuItem value={"shared"}>Shared</MenuItem>
            <MenuItem value={"received"}>Received</MenuItem>
            <MenuItem value={"owned"}>Owned</MenuItem>
          </Select>
        </div>

        <div>
          <RecentFiles filteredData={filteredData} loading={loading} />
        </div>
      </Box>
    </div>
  );
}
