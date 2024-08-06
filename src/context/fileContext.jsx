import { createContext, useState } from "react";
import { useAuth } from "./authContext";
import secureLocalStorage from "react-secure-storage";
import { useDepartment } from "./departmentContext";
import { api } from "../utils/axios-instance";

const fileContext = createContext();

export const FileState = (props) => {
  const [files, setFiles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [folders, setFolders] = useState([]);
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
            isLocked: file?.is_locked,
            hasPassword: file?.has_password,
            password: file?.password,
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
      const response = await api.get(`/file/files/${deptName}`);
      console.log(response);

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
          const filteredDepartment = departments.filter(
            (dept) => dept.id === file.department_ids[0]
          );

          return {
            id: file.id,
            name: file.name.substring(0, 80),
            profilePic: file.profile_pic,
            size: formatFileSize(file.metadata.size),
            dept: file.department_ids,
            owner: file.owner_email,
            mimetype: file.metadata.mimetype,
            status: "Team",
            security: "Enhanced",
            color: filteredDepartment[0]?.metadata.bg,
            isLocked: file?.is_locked,
            hasPassword: file?.has_password,
            password: file?.password,
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

        console.log(departments);

        const getDepartmentId = departments.find(
          (dept) => dept.name === deptName
        );

        console.log(getDepartmentId);

        const filteredFiles = mappedFiles.filter((file) =>
          file.dept.find((id) => id === getDepartmentId.id)
        );
        
        console.log(filteredFiles);
        setDepartmentFiles(filteredFiles);
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
        selectedFiles,
        setSelectedFiles,
        folders,
        setFolders,
      }}
    >
      {props.children}
    </fileContext.Provider>
  );
};

export default fileContext;

/* 
{'id': '085f06ab-2ba0-45fe-bf27-15366437323f', 'password': None, 'created_at': DatetimeWithNanoseconds(2024, 8, 3, 6, 21, 58, 579000, tzinfo=datetime.timezone.utc), 'metadata': {'lastModified': '3 Aug 2024, 11:51 am', 'size': 2636186, 'mimetype': 'image/png'}, 'owner_id': 'lSAE9QzwhYX0C8mU30nz9qQwI0k2', 'download_url': 'https://firebasestorage.googleapis.com/v0/b/twokey-a14ec.appspot.com/o/files%2FsJ294kSQsls0IldoNtDK%2Fpost%202.png?alt=media&token=388df1a8-ae8d-4d69-86a0-36b7b7570487', 'department_ids': ['CiqWM2Sf0xd6XIYAEOf3'], 'profile_pic': 'https://storage.googleapis.com/twokey-a14ec.appspot.com/user_data/lSAE9QzwhYX0C8mU30nz9qQwI0k2/profile_pictures/lSAE9QzwhYX0C8mU30nz9qQwI0k2_c9563a21-8430-41eb-b3fc-69c0af6f02e4.jpg', 'is_locked': True, 'updated_at': DatetimeWithNanoseconds(2024, 8, 3, 14, 11, 43, 888000, tzinfo=datetime.timezone.utc), 'has_password': False, 'name': 'post 2.png'}, {'id': '0acf73ce-b368-422d-b317-ef36767da5b8', 'password': None, 'created_at': DatetimeWithNanoseconds(2024, 8, 5, 9, 6, 29, 885000, tzinfo=datetime.timezone.utc), 'metadata': {'lastModified': '5 Aug 2024, 2:36 pm', 'size': 2424011, 'mimetype': 'image/png'}, 'owner_id': 'lSAE9QzwhYX0C8mU30nz9qQwI0k2', 'download_url': 'https://firebasestorage.googleapis.com/v0/b/twokey-a14ec.appspot.com/o/files%2FsJ294kSQsls0IldoNtDK%2FCopy%20of%20Copy%20of%20post%203%20(2).png?alt=media&token=f98fae7e-f449-454c-8cdc-635cfa42893c', 'department_ids': ['CiqWM2Sf0xd6XIYAEOf3'], 'profile_pic': 'https://storage.googleapis.com/twokey-a14ec.appspot.com/user_data/lSAE9QzwhYX0C8mU30nz9qQwI0k2/profile_pictures/lSAE9QzwhYX0C8mU30nz9qQwI0k2_c9563a21-8430-41eb-b3fc-69c0af6f02e4.jpg', 'is_locked': True, 'updated_at': DatetimeWithNanoseconds(2024, 8, 5, 12, 18, 30, 83000, tzinfo=datetime.timezone.utc), 'has_password': False, 'name': 'Copy of Copy of post 3 (2).png'}
*/
