import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ProfileLogs from "../components/ProfileLogs";
import axios from "axios";
import LatestActivities from "../components/LatestActivities";
import CustomLogs from "./CustomLogs";
import { useParams } from "react-router-dom";

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
  const [sharedLogs, setSharedLogs] = useState([]);
  const [receivedLogs, setReceivedLogs] = useState([]);
  const [latestLogs, setLatestLogs] = useState([]);
  const [downloadLogs, setDownloadLogs] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let token = JSON.parse(sessionStorage.getItem("token"));

        const [sharedLogsResponse, receivedLogsResponse, latestLogsResponse] =
          await Promise.all([
            axios.get(
              `https://twokeybackend.onrender.com/users/getUserInfo/${userId}?type=shared`,
              {
                headers: {
                  Authorization: `Bearer ${token.session.access_token}`,
                },
              }
            ),
            axios.get(
              `https://twokeybackend.onrender.com/users/getUserInfo/${userId}?type=received`,
              {
                headers: {
                  Authorization: `Bearer ${token.session.access_token}`,
                },
              }
            ),
            axios.get(
              `https://twokeybackend.onrender.com/users/getUserInfo/${userId}/?logs=1&recs=15`,
              {
                headers: {
                  Authorization: `Bearer ${token.session.access_token}`,
                },
              }
            ),
          ]);

        setSharedLogs(sharedLogsResponse.data.files);
        setReceivedLogs(receivedLogsResponse.data.files);
        setLatestLogs(latestLogsResponse.data);

        const downloadLogsData = latestLogsResponse.data.filter(
          (log) => log.event === "download"
        );
        setDownloadLogs(downloadLogsData);
      } catch (error) {
        console.error("Error fetching logs:", error);
        // Handle error, show user-friendly message, or log it as needed
      }
    };

    fetchLogs();
  }, [userId]);

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
            label="File Shared to"
            {...a11yProps(0)}
            sx={{ textTransform: "capitalize", fontSize: "small" }}
          />
          <Tab
            label="File Shared from"
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
        <ProfileLogs logs={sharedLogs} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ProfileLogs logs={receivedLogs} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <CustomLogs logs={latestLogs} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <CustomLogs logs={downloadLogs} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        Edited Files
      </CustomTabPanel>
    </Box>
  );
}
