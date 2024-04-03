import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import RecentFiles from "./RecentFiles";
import { useAuth } from "../context/authContext";
import UploadFile from "./UploadFile";
import SecureShare from "./SecureShare";
import { useDarkMode } from "../context/darkModeContext";
import PropTypes from "prop-types";

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

export default function DashboardTabs() {
  const { formatFileSize } = useAuth();
  const { darkMode } = useDarkMode();
  const location = useLocation();
  const [value, setValue] = useState(0);
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
          case 0:
            url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files/?recs=25`;
            break;
          case 1:
            url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files?type=shared`;
            break;
          case 2:
            url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files?type=received`;
            break;
          case 3:
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

            // Sort the mappedFiles array based on the lastUpdate property
            mappedFiles.sort((a, b) => {
              return new Date(b.lastUpdate) - new Date(a.lastUpdate);
            });

            // Replace the cached recent files data with the new data
            secureLocalStorage.setItem(cacheKey, JSON.stringify(mappedFiles));

            // Update the state with the new data
            // setFilteredData(mappedFiles);
            if (location.pathname !== "/dashboard") {
              // If location is other than "dashboard", send only the first 5 items
              setFilteredData(mappedFiles.slice(0, 5));
            } else {
              // If location is "dashboard", send all filtered data
              setFilteredData(mappedFiles);
            }
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

  const handleChange = (event, newValue) => {
    // Reset logs state to null when changing tabs
    // setLogs(null);
    setValue(newValue);
  };

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
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label="All"
              {...a11yProps(0)}
              sx={{ textTransform: "capitalize", fontSize: "small" }}
            />
            <Tab
              label="Shared"
              {...a11yProps(1)}
              sx={{ textTransform: "capitalize", fontSize: "small" }}
            />
            <Tab
              label="Received"
              {...a11yProps(2)}
              sx={{ textTransform: "capitalize", fontSize: "small" }}
            />
            <Tab
              label="owned"
              {...a11yProps(3)}
              sx={{ textTransform: "capitalize", fontSize: "small" }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <RecentFiles filteredData={filteredData} loading={loading} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <RecentFiles filteredData={filteredData} loading={loading} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <RecentFiles filteredData={filteredData} loading={loading} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <RecentFiles filteredData={filteredData} loading={loading} />
        </CustomTabPanel>
      </Box>
    </div>
  );
}
