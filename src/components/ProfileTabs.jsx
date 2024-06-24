import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ProfileLogs from "../components/ProfileLogs";
import LatestActivities from "../components/LatestActivities";
import CustomLogs from "./CustomLogs";
import secureLocalStorage from "react-secure-storage";
import RecentFiles from "./RecentFiles";
import { useAuth } from "../context/authContext";
import { api } from "../utils/axios-instance";

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
  const [value, setValue] = useState(0);
  const [logs, setLogs] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { formatFileSize } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let token = secureLocalStorage.getItem("token");
        let url;

        // Determine the URL based on the selected tab
        switch (value) {
          case 0:
            url = `/file/files?type=shared`;
            break;
          case 1:
            url = `/file/files?type=received`;
            break;
          case 3:
            url = `/file/getLogs/download`;
            break;

          default:
            url = "";
            break;
        }

        // Check if the URL is empty before making the request
        if (url) {
          const accessLogs = await api.get(url);

          // console.log(`Profile Tabs`, accessLogs.data);

          setLogs(accessLogs.data);

          if (accessLogs) {
            const mappedFiles = accessLogs.data.map((file) => {
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
                color: file.file_info[0]?.depts[0]?.metadata?.bg,
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

            setFilteredData(mappedFiles);
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
    setLogs(null);
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Shared"
            {...a11yProps(0)}
            sx={{ textTransform: "capitalize", fontSize: "small" }}
          />
          <Tab
            label="Received"
            {...a11yProps(1)}
            sx={{ textTransform: "capitalize", fontSize: "small" }}
          />
          <Tab
            label="User Activity"
            {...a11yProps(2)}
            sx={{ textTransform: "capitalize", fontSize: "small" }}
          />
          <Tab
            label="Download"
            {...a11yProps(3)}
            sx={{ textTransform: "capitalize", fontSize: "small" }}
          />
          <Tab
            label="Edited Files"
            {...a11yProps(4)}
            sx={{ textTransform: "capitalize", fontSize: "small" }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {/* <ProfileLogs type={"shared"} logs={logs} /> */}
        <RecentFiles filteredData={filteredData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {/* <ProfileLogs type={"received"} logs={logs} /> */}
        <RecentFiles filteredData={filteredData} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <LatestActivities />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <CustomLogs logs={logs} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        Edited Files
      </CustomTabPanel>
    </Box>
  );
}
