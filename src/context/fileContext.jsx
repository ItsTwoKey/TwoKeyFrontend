import { createContext, useState } from "react";
import { useAuth } from "./authContext";
import secureLocalStorage from "react-secure-storage";
import { useDepartment } from "./departmentContext";
import { api } from "../utils/axios-instance";

const fileContext = createContext();

export const FileState = (props) => {
  const [files, setFiles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [departmentFiles, setDepartmentFiles] = useState([]);
  const { departments } = useDepartment();
  const location = window.location.pathname;

  const { formatFileSize } = useAuth();

  const removeFile = async (fileid) => {
    let removedFile = filteredData.filter((file) => file.id !== fileid);
    setAnchorEl(null);
    setFilteredData(removedFile);
  };

  const updateFilesState = async (value = 0) => {
    try {
      let url;

      // Determine the URL based on the selected tab
      switch (parseInt(value)) {
        case 0:
          url = `/file/files`;
          break;
        case 1:
          url = `/file/files?type=shared`;
          break;
        case 2:
          url = `/file/files?type=received`;
          break;
        case 3:
          url = `/file/files?type=owned`;
          break;

        default:
          url = `/file/files`;
          break;
      }

      if (url) {
        const getFiles = await api.get(url);

        setFiles(getFiles.data);

        const cacheKey = "recentFilesCache";

        const mappedFiles = getFiles.data.map((file) => {
          // destucture and extract dept name of every file
          try {
            const [{ depts }, ...extra] = file.file_info;
            const [{ name }, ...more] = depts;
            file.department = name;
          } catch (err) {
            file.department = "";
          }

          const filteredDepartment = departments.filter(
            (dept) => dept.id === file.department_ids[0]
          );

          return {
            id: file.id,
            name: file.name.substring(0, 80),
            profilePic: file.profile_pic,
            size: formatFileSize(file.metadata.size),
            dept: file.department_ids,
            owner: file.owner_id,
            mimetype: file.metadata.mimetype,
            status: "Team",
            security: "Enhanced",
            color: filteredDepartment[0]?.metadata.bg,
            downloadUrl: file.download_url,
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
          setFilteredData(mappedFiles.slice(0, 5));
        } else {
          // If location is "dashboard", send all filtered data
          setFilteredData(mappedFiles);
          // console.log("updated files:", value);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateDepartmentFiles = async (deptName) => {
    try {
      const response = await api.get(`/file/files/${deptName}/?recs=25`);

      if (response) {
        const mappedFiles = response.data.map((file) => {
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
        setDepartmentFiles(mappedFiles);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
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
        updateDepartmentFiles,
        departmentFiles,
        setDepartmentFiles,
      }}
    >
      {props.children}
    </fileContext.Provider>
  );
};

export default fileContext;
