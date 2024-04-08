import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RecentFiles from "../components/RecentFiles";
import ErrorPage from "../components/ErrorPage";
import secureLocalStorage from "react-secure-storage";
import UploadFile from "../components/UploadFile";
import SecureShare from "../components/SecureShare";
import { useDarkMode } from "../context/darkModeContext";
import { useAuth } from "../context/authContext";

const Department = () => {
  const { darkMode } = useDarkMode();
  const { formatFileSize } = useAuth();
  const { deptName } = useParams();
  const [filesFromBackend, setFilesFromBackend] = useState([]);
  const [loading, setLoading] = useState(true); // Initialize loading state as true

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = JSON.parse(secureLocalStorage.getItem("token"));

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files/${deptName}/?recs=25`,
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

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
          setFilesFromBackend(mappedFiles);
        }

        setLoading(false); // Once data is fetched, set loading to false
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false); // Set loading to false in case of error as well
      }
    };

    fetchData();
  }, [deptName]);

  if (!secureLocalStorage.getItem("token")) {
    return <ErrorPage error="You are not authorised" />;
  }
  return (
    <div className="p-4">
      <div
        className={`my-4 flex flex-row justify-between items-center ${
          darkMode && "text-gray-200"
        }`}
      >
        <p className="text-2xl font-semibold ">{deptName} Files</p>
        <span className="flex gap-2">
          <SecureShare />
          <UploadFile />
          {/* <ShareFile /> */}
        </span>
      </div>
      {/* <h1>{deptName}</h1> */}
      {loading ? (
        <p>Loading...</p> // Display loading indicator while fetching data
      ) : (
        <RecentFiles filteredData={filesFromBackend} loading={loading} />
      )}
    </div>
  );
};

export default Department;
