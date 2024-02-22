import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useDropzone } from "react-dropzone";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import * as tus from "tus-js-client";
import { styled } from "@mui/material/styles";
import FileIcon from "../../assets/fileIcon.svg";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import secureLocalStorage from "react-secure-storage";
import * as XLSX from "xlsx";
import BulkInvite from "../../assets/BulkInvite.svg";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "green" : "green",
  },
}));

const ImportMember = (props) => {
  const resumableEndpt = process.env.REACT_APP_RESUMABLE_URL;
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [excelData, setExcelData] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Handle dropped files here
      // console.log("Accepted Files:", acceptedFiles);
      setDroppedFiles(acceptedFiles);
    },
  });

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setDroppedFiles([]);
  };

  const inviteMembers = async (emails) => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));

      let body = {
        emails: emails,
      };

      let response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/invite/`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log("invite members:", response);
      // closeDialog();
    } catch (error) {
      console.log("error occurew while adding dept", error);
    }
  };

  const readExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });

      // Assuming the first sheet is the one you want to read
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet to an array of objects
      const content = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setExcelData(content);
      let data = content
        .map((row) =>
          row.filter((i) => i.split("@").length > 1 && i.split(".").length > 1)
        )
        .join(",");
      const emails = data.replaceAll("'", "").split(",");
      // setEmailList(emails);
      inviteMembers(emails);
      console.log(emails);
    };

    reader.readAsBinaryString(file);
  };

  const readCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      let data = content
        .split(",")
        .filter((i) => i.split("@").length > 1 && i.split(".").length > 1);
      const emails = data.map((email) => email.replaceAll("'", ""));
      // setEmailList(emails);
      inviteMembers(emails);
      console.log(emails);
    };
    reader.readAsText(file);
  };

  const extractEmails = () => {
    if (droppedFiles[0].name.endsWith(".csv")) readCSV(droppedFiles[0]);
    else if (droppedFiles[0].name.endsWith(".xlsx")) readExcel(droppedFiles[0]);
    setTimeout(() => props.close(), 100);
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
      <div
        onClick={openDialog}
        className="py-4 px-4 rounded-md border bg-[#f7f7ff] flex flex-col items-center hover:bg-indigo-100"
      >
        <img src={BulkInvite} alt="Bulk invite" className="h-10 aspect-auto" />
        Import Members
      </div>

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
            <h4 className="font-semibold text-md">Bulk Invite</h4>
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
                Drag and drop CSV / XLSX files here, or click here to select
                files for Bulk Member Invite
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
                !droppedFiles.length
                  ? "border-gray-500 text-gray-500 hover:bg-gray-200 cursor-progress"
                  : "hover:bg-[#5551cc] text-white bg-[#5E5ADB]"
              } text-sm font-semibold`}
              onClick={extractEmails}
              disabled={!droppedFiles.length ? true : false}
            >
              Imoprt
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImportMember;
