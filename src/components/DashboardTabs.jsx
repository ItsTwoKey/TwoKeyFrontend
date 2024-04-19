import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
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
import fileContext from "../context/fileContext";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
  // use both of these state from context
  // const [files, setFiles] = useState([]);
  // const [filteredData, setFilteredData] = useState([]);

  const context = useContext(fileContext);
  const { files, setFiles, filteredData, setFilteredData } = context;
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  //   realtime supabase subscribe
  // useEffect(() => {
  //   const channel = supabase
  //     .channel("custom_all_channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "file_info" },
  //       () => {
  //         console.log("File Change received!");

  //         // console.log("common logs subscribed");
  //         fetchFiles();
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, []);
  useEffect(() => {
    fetchFiles();
  }, [value, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update currentPage when pagination changes
  };

  const handleTabChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    fetchFiles();
  }, [value]);

  const fetchFiles = async () => {
    try {
      setLoading(true); // Set loading state to true when fetching data

      let token = JSON.parse(secureLocalStorage.getItem("token"));
      let url;

      switch (value) {
        case 0:
          url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files?p=${currentPage}`;
          break;
        case 1:
          url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files?type=shared&p=${currentPage}`;
          break;
        case 2:
          url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files?type=received&p=${currentPage}`;
          break;
        case 3:
          url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files?type=owned&p=${currentPage}`;
          break;
        default:
          url = "";
          break;
      }

      if (url) {
        const getFiles = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        });

        console.log(`dashboard Tabs`, getFiles.data);
        setFiles(getFiles.data);
        setTotalPages(Math.ceil(getFiles.headers.count / 25));

        const cacheKey = "recentFilesCache";

        const mappedFiles = getFiles.data.map((file) => {
          try {
            const [{ depts }, ...extra] = file.file_info;
            const [{ name }, ...more] = depts;
            file.department = name;
          } catch (err) {
            file.department = "";
          }

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

        mappedFiles.sort((a, b) => {
          return new Date(b.lastUpdate) - new Date(a.lastUpdate);
        });

        secureLocalStorage.setItem(cacheKey, JSON.stringify(mappedFiles));

        if (location.pathname !== "/dashboard") {
          setFilteredData(mappedFiles.slice(0, 5));
        } else {
          setFilteredData(mappedFiles);
        }

        setLoading(false); // Set loading state to false when data fetching is complete
      } else {
        console.log("URL is empty. Skipping request.");
      }
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading state to false if an error occurs
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentPage(1); // Reset currentPage when changing tabs
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
          <SecureShare value={value} />
          <UploadFile value={value} />
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
              sx={{
                textTransform: "capitalize",
                fontSize: "small",
                color: darkMode ? "white" : "black",
              }}
            />
            <Tab
              label="Shared"
              {...a11yProps(1)}
              sx={{
                textTransform: "capitalize",
                fontSize: "small",
                color: darkMode ? "white" : "black",
              }}
            />
            <Tab
              label="Received"
              {...a11yProps(2)}
              sx={{
                textTransform: "capitalize",
                fontSize: "small",
                color: darkMode ? "white" : "black",
              }}
            />
            <Tab
              label="owned"
              {...a11yProps(3)}
              sx={{
                textTransform: "capitalize",
                fontSize: "small",
                color: darkMode ? "white" : "black",
              }}
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

      {files.length ? (
        <div className="flex justify-center items-center my-4">
          <Stack spacing={2}>
            <Pagination
              count={totalPages} // Assuming there are 10 pages
              page={currentPage}
              onChange={handlePageChange}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
            />
          </Stack>
        </div>
      ) : (
        " "
      )}
    </div>
  );
}
