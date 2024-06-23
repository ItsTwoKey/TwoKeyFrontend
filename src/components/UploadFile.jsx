import React, { useState, useEffect, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useDropzone } from "react-dropzone";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import * as tus from "tus-js-client";
import { styled } from "@mui/material/styles";
import FileIcon from "../assets/fileIcon.svg";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import secureLocalStorage from "react-secure-storage";
import fileContext from "../context/fileContext";
import TextField from "@mui/material/TextField";
import { useAuth } from "../context/authContext";
import { auth, storage } from "../helper/firebaseClient";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { api } from "../utils/axios-instance";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#3B82F6" : "#B3A9EB",
  },
}));

const UploadFile = ({ value }) => {
  const resumableEndpt = process.env.REACT_APP_RESUMABLE_URL;
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [depts, setdepts] = useState([]);
  const [deptId, setDeptId] = useState("");
  const [selectedDeptIndex, setSelectedDeptIndex] = useState(null);
  const [isFieldsFilled, setIsFieldsFilled] = useState(false);
  const { profileData } = useAuth();
  const [description, setDescription] = useState({
    content: "",
    visible: false,
  });
  const { deptName } = useParams();
  const context = useContext(fileContext);
  const { updateFilesState, updateDepartmentFiles } = context;

  // Function to check if both fields are filled
  const checkFields = () => {
    if (deptId !== "" && droppedFiles.length > 0) {
      setIsFieldsFilled(true);
      // droppedFiles.length === 1
      //   ? setDescription({ ...description, ["visible"]: true })
      //   : setDescription({ ...description, ["visible"]: false });
    } else {
      setIsFieldsFilled(false);
      // droppedFiles.length === 1
      //   ? setDescription({ ...description, ["visible"]: true })
      //   : setDescription({ ...description, ["visible"]: false });
    }
  };
  // const handleDesc = (e) => {
  //   setDescription({ ...description, ["content"]: e.target.value });
  // };

  // Add useEffect to check fields whenever deptId or droppedFiles change
  useEffect(() => {
    checkFields();
  }, [deptId, droppedFiles]);

  const handleDepartmentClick = (index, id) => {
    console.log("Selected department id:", id);
    setDeptId(id);
    setSelectedDeptIndex(index);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Handle dropped files here
      console.log("Accepted Files:", acceptedFiles);
      setDroppedFiles(acceptedFiles);
    },
  });

  const uploadFile = async (file, index) => {
    return new Promise((resolve, reject) => {
      const fileRef = ref(storage, `files/${profileData.org}/${file.name}`);
      const metadata = {
        customMetadata: {
          department_id: deptId,
          org_id: profileData.org,
        },
      };
      const uploadTask = uploadBytesResumable(fileRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("File upload error:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleFinalUpload = async () => {
    try {
      for (const file of droppedFiles) {
        const downloadURL = await uploadFile(file);
        console.log("uploaded file:", downloadURL);
        await handleFileIdRetrieval(file, file.name, downloadURL);
      }
      showSnackbar("Upload successful", "success");
    } catch (error) {
      console.error("Error occurred in file upload:", error);
      showSnackbar("Upload failed. Please try again.", "error");
    } finally {
      setUploadProgress(0);
      setDroppedFiles([]);
    }
  };

  const handleFileIdRetrieval = async (file, desiredFileName, downloadURL) => {
    const token = await auth.currentUser.getIdToken();
    try {
      const res = await api.post(`/file/addDepartment/${desiredFileName}`, {
        department_ids: [deptId],
        new: true,
        name: desiredFileName,
        downloadURL: downloadURL,
        idToken: token,
        metadata: {
          size: file.size,
          mimetype: file.type,
          lastModified: new Date().toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        },
      });

      console.log("File ID retrieval response:", res.data);
      showSnackbar(res.data.detail, "success");

      updateFilesState(value);
      console.log("deptName", deptName, value);
      if (deptName) {
        updateDepartmentFiles(deptName);
      }
    } catch (error) {
      console.log(error);
      showSnackbar("Error retreiving data", "error");
    }
  };

  // const addFileDescription = async (fileId) => {
  //   try {
  //     let token = JSON.parse(secureLocalStorage.getItem("token"));

  //     let body = {
  //       metadata: {
  //         description,
  //       },
  //     };

  //     const addDesc = await axios.post(
  //       `${process.env.REACT_APP_BACKEND_BASE_URL}/file/shareFile`,
  //       body,
  //       {
  //         headers: {
  //           authorization: `Bearer ${token.session.access_token}`,
  //         },
  //       }
  //     );

  //     console.log("description of file", addDesc);
  //   } catch (error) {
  //     console.log("Error occured while adding the file department", error);
  //   }
  // };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const openDialog = () => {
    setIsOpen(true);
    const departments = JSON.parse(secureLocalStorage.getItem("departments"));

    setdepts(departments);
    console.log("upload files", departments);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setDroppedFiles([]);
    setUploadProgress(0);
  };

  function formatFileSize(sizeInBytes) {
    const units = ["B", "KB", "MB", "GB"];
    let size = sizeInBytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return size.toFixed(2) + " " + units[unitIndex];
  }

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="py-1 px-4 rounded-md border bg-blue-700 hover:bg-blue-500 text-white"
      >
        Upload Files
      </button>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>
          <span>
            <h4 className="font-semibold text-md">Upload Files</h4>
            {/* <p className="text-sm">
              Share your project collaborate with your team
            </p> */}
          </span>
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div className="my-4 w-[486px]">
            <div
              {...getRootProps()}
              className={`dropzone mt-4 h-60 w-full flex items-center justify-center border-2 border-dashed border-blue-500 text-[#2C6ECB] bg-[#F2F7FE] p-4 rounded-md text-center cursor-pointer`}
            >
              <input {...getInputProps()} />
              <p className="text-sm">
                Drag and drop files here, or click to select files
              </p>
            </div>

            {droppedFiles.length > 0 && (
              <div>
                {droppedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-row justify-between items-center my-2"
                  >
                    <span className="flex flex-row items-center gap-2">
                      <img src={FileIcon} alt="." />
                      <p className="text-sm font-bold">{file.name}</p>
                    </span>
                    <p className="text-sm">{formatFileSize(file.size)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* {description.visible && (
              <div className="py-5 flex flex-col gap-2 justify-start w-full">
                <TextField
                  id="desc"
                  label="File Description"
                  onChange={handleDesc}
                  value={description.content}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>
            )} */}

            <div className="grid grid-cols-3 gap-2 my-4">
              {depts.map((dept, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: dept.metadata.bg,
                    border:
                      selectedDeptIndex === index
                        ? "2px solid black"
                        : "1px solid silver", // Applying border to selected department
                  }}
                  className={`flex justify-center items-center p-2 rounded-lg cursor-pointer`}
                  onClick={() => handleDepartmentClick(index, dept.id)}
                >
                  {dept.name.replace("_", " ")}
                </div>
              ))}
            </div>

            {uploadProgress > 0 && (
              <BorderLinearProgress
                variant="determinate"
                value={uploadProgress}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <div className="flex justify-between w-full px-2">
            <button
              className="px-3 py-1.5 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-100 text-sm font-semibold"
              onClick={closeDialog}
              color="primary"
            >
              Cancel
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg shadow-sm border ${
                !isFieldsFilled || !droppedFiles.length
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : uploadProgress > 0
                  ? "border-gray-500 text-gray-500 hover:bg-gray-200 cursor-progress"
                  : "border-[#5E5ADB] text-[#5E5ADB] hover:bg-blue-100"
              } text-sm font-semibold`}
              onClick={handleFinalUpload}
              disabled={
                !droppedFiles.length || !isFieldsFilled || uploadProgress > 0
              }
            >
              Upload
            </button>
            {/* <button
              className={`px-3 py-1.5 rounded-lg shadow-sm border ${
                !isFieldsFilled || (droppedFiles.length === 1 && !description.content)
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : uploadProgress > 0
                  ? "border-gray-500 text-gray-500 hover:bg-gray-200 cursor-progress"
                  : "border-[#5E5ADB] text-[#5E5ADB] hover:bg-blue-100"
              } text-sm font-semibold`}
              onClick={handleFinalUpload}
              disabled={
                (droppedFiles.length === 1 && !description.content) ||
                !isFieldsFilled ||
                uploadProgress > 0
              }
            >
              Upload
            </button> */}
          </div>
        </DialogActions>
        {uploadProgress > 90 && (
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <MuiAlert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </MuiAlert>
          </Snackbar>
        )}
      </Dialog>
    </div>
  );
};

export default UploadFile;
