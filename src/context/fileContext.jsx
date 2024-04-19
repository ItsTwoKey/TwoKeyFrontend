import { createContext, useState } from "react";
import { useAuth } from "./authContext";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

const fileContext = createContext();

export const FileState = (props) => {
  const [files, setFiles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = window.location.pathname;

  const { formatFileSize } = useAuth();

  const removeFile = async (fileid) => {
    let removedFile = filteredData.filter((file) => file.id !== fileid);
    setAnchorEl(null);
    setFilteredData(removedFile);
  };

  const updateFilesState = async (value = 0) => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));
      let url;

      // Determine the URL based on the selected tab
      switch (parseInt(value)) {
        case 0:
          url = `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files/?p=1`;
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
      if (url) {
        const getFiles = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        });
        setFiles(getFiles.data);

        const cacheKey = "recentFilesCache";

        if (getFiles) {
          const mappedFiles = getFiles.data.map((file) => {
            // destucture and extract dept name of every file
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

          // Sort the mappedFiles array based on the lastUpdate property
          mappedFiles.sort((a, b) => {
            return new Date(b.lastUpdate) - new Date(a.lastUpdate);
          });

          // Replace the cached recent files data with the new data
          secureLocalStorage.setItem(cacheKey, JSON.stringify(mappedFiles));

          // Update the state with the new data
          // setFilteredData(mappedFiles);
          if (location !== "/dashboard") {
            // If location is other than "dashboard", send only the first 5 items
            setFilteredData(mappedFiles);
          } else {
            // If location is "dashboard", send all filtered data
            setFilteredData(mappedFiles);
            // console.log("updated files:", value);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <fileContext.Provider
      value={{
        files,
        setFiles,
        filteredData,
        setFilteredData,
        updateFilesState,
        removeFile,
        anchorEl,
        setAnchorEl,
      }}
    >
      {props.children}
    </fileContext.Provider>
  );
};

export default fileContext;
