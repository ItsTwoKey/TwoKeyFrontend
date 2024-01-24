import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DashboardFiles from "../components/DashboardFiles";
import ProfileLogs from "../components/ProfileLogs";
import axios from "axios";

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

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        let token = JSON.parse(localStorage.getItem("token"));
        let url;

        // Determine the URL based on the selected tab
        switch (value) {
          case 1:
            url = "https://twokeybackend.onrender.com/file/files?type=shared";
            break;
          case 2:
            url = "https://twokeybackend.onrender.com/file/files?type=received";
            break;
          case 3:
            url = "https://twokeybackend.onrender.com/file/files?type=owned";
            break;

          default:
            url = "";
            break;
        }

        // Check if the URL is empty before making the request
        if (url) {
          const accessLogs = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          });

          console.log(`Profile Tabs`, accessLogs.data);
          setLogs(accessLogs.data);
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
    <Box sx={{ width: "100%", marginTop: 2 }}>
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
            label="Owned"
            {...a11yProps(3)}
            sx={{ textTransform: "capitalize", fontSize: "small" }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DashboardFiles />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ProfileLogs logs={logs} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ProfileLogs logs={logs} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ProfileLogs logs={logs} />
      </CustomTabPanel>
    </Box>
  );
}
