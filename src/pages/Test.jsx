import React, { useState, useEffect } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function FileUploadComponent() {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleFilelisting = async (page) => {
    let token = JSON.parse(secureLocalStorage.getItem("token"));
    try {
      const getFiles = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files?p=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      console.log("Files:", getFiles.data);
      console.log("Response Headers:", getFiles); // Log response headers
      setFiles(getFiles.data);
      setTotalPages(Math.ceil(getFiles.headers.count / 25));
    } catch (error) {
      console.error("Error at file listing test:", error.message);
    }
  };

  useEffect(() => {
    handleFilelisting(currentPage); // Fetch files when component mounts or currentPage changes
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update currentPage when pagination changes
  };

  return (
    <>
      <div>
        <button onClick={() => handleFilelisting(1)}>get files</button>{" "}
        {/* Submit button for file update */}
        {files.length && (
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
        )}
      </div>
    </>
  );
}

export default FileUploadComponent;
