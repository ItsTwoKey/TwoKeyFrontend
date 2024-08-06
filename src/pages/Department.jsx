import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecentFiles from "../components/RecentFiles";
import ErrorPage from "../components/ErrorPage";
import secureLocalStorage from "react-secure-storage";
import UploadFile from "../components/UploadFile";
import SecureShare from "../components/SecureShare";
import { useDarkMode } from "../context/darkModeContext";
import { useAuth } from "../context/authContext";
import fileContext from "../context/fileContext";
import { useDepartment } from "../context/departmentContext";
import { api } from "../utils/axios-instance";
import MultipleFileMenu from "../components/MultipleFileMenu";

const Department = () => {
  const { darkMode } = useDarkMode();
  const { formatFileSize } = useAuth();
  const { deptName } = useParams();
  const [filesFromBackend, setFilesFromBackend] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize loading state as true
  const context = useContext(fileContext);
  const { departmentFiles, setDepartmentFiles } = context;
  const { departments } = useDepartment();
  const [select, setSelect] = useState(false);
  const [showMultiFileOptions, setShowMultiFileOptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/file/files`);

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
              size: formatFileSize(file?.metadata?.size),
              dept: file.department_ids,
              owner: file.owner_id,
              mimetype: file.metadata.mimetype,
              status: "Team",
              security: "Enhanced",
              color: filteredDepartment[0]?.metadata?.bg,
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

          const getDepartmentId = departments.find(
            (dept) => dept.name === deptName
          );

          const filteredFiles = mappedFiles.filter((file) =>
            file.dept.find((id) => id === getDepartmentId.id)
          );

          console.log(filteredFiles);
          setFilesFromBackend(filteredFiles);
          setDepartmentFiles(filteredFiles);
        }

        setLoading(false); // Once data is fetched, set loading to false
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false); // Set loading to false in case of error as well
      }
    };

    fetchData();
  }, [deptName]);

  useEffect(() => {
    setFilesFromBackend(departmentFiles);
  }, [departmentFiles]);

  if (!secureLocalStorage.getItem("token")) {
    return <ErrorPage error="You are not authorised" />;
  }

  const removeFiles = () => {
    const idsToRemove = context.selectedFiles.map((file) => file.id);

    const updatedFiles = filesFromBackend.filter(
      (file) => !idsToRemove.includes(file.id)
    );

    setFilesFromBackend(updatedFiles);
  };

  const updateFiles = (file, val) => {
    setFilesFromBackend((prevData) =>
      prevData.map((data) =>
        data.id === file.id ? { ...data, isLocked: val } : data
      )
    );
  };

  return (
    <div>
      <div
        className={`my-4 flex flex-row justify-between items-center w-full px-8 bg-[#F1F1FF] ${
          darkMode && "text-gray-200"
        }`}
      >
        <p
          className={`text-2xl font-semibold ${
            darkMode ? "text-black" : "text-black"
          }`}
        >
          {deptName} Files
        </p>
        <span className="flex gap-2">
          {showMultiFileOptions && (
            <MultipleFileMenu
              removeMultiSelect={() => setSelect(false)}
              location="department"
              removeFiles={removeFiles}
              deptName={deptName}
            />
          )}
          <SecureShare value={0} />
          <UploadFile value={0} />
          <button
            className="py-1 px-4 rounded-md border"
            onClick={() => setSelect(!select)}
            style={{
              backgroundColor: select ? "grey" : "#1c4ed8",
              color: "white",
            }}
          >
            Select Files
          </button>
          {/* <ShareFile /> */}
        </span>
      </div>
      {/* <h1>{deptName}</h1> */}
      <div className="p-4">
        {loading ? (
          <p>Loading...</p> // Display loading indicator while fetching data
        ) : (
          <RecentFiles
            filteredData={filesFromBackend}
            loading={loading}
            select={select}
            setSelect={setSelect}
            showMultiFileOptions={showMultiFileOptions}
            setShowMultiFileOptions={setShowMultiFileOptions}
            deptName={deptName}
          />
          // <RecentFiles filteredData={departmentFiles} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default Department;
