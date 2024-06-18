import React, { useContext, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { supabase } from "../helper/supabaseClient";
import Danger from "../assets/danger.svg";
import secureLocalStorage from "react-secure-storage";
import fileContext from "../context/fileContext";
import { useParams } from "react-router-dom";
import { getFirestore } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import axios from "axios";

const DeleteFileConfirmation = ({ fileName, owner, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" or "error"
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { deptName } = useParams();
  const context = useContext(fileContext);
  const { removeFile, setAnchorEl, updateDepartmentFiles } = context;

  console.log(fileName, owner, id);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    let profileData = JSON.parse(secureLocalStorage.getItem("profileData"));
    let token = secureLocalStorage.getItem("token");

    // Check if the user is the owner of the file
    // console.log(fileName);

    if (profileData.id === owner) {
      try {
        const storage = getStorage();
        const fileRef = ref(storage, `files/${profileData.org}/${fileName}`);

        await deleteObject(fileRef);
        console.log("Delete success");

        const res = await axios.delete(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/file/delete-file/${id}/`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setSnackbarSeverity("success");
        setSnackbarMessage("File deleted successfully.");
        setSnackbarOpen(true);

        removeFile(id);
        if (deptName) updateDepartmentFiles(deptName);

        setTimeout(() => {
          closeDialog();
        }, 3000);
      } catch (error) {
        console.error("Error occurred while deleting the file:", error.message);
        setSnackbarSeverity("error");
        setSnackbarMessage("Error deleting the file.");
        setSnackbarOpen(true);
      }
    } else {
      // Display Snackbar message if the user is not the owner of the file
      setSnackbarSeverity("error");
      setSnackbarMessage("You are not the owner of the file.");
      setSnackbarOpen(true);
      setTimeout(() => {
        closeDialog();
      }, 3000);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);

    // Close the dialog after 3 seconds
  };

  return (
    <div className="">
      <button onClick={openDialog} className="text-[#D1293D]">
        Delete File
      </button>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "5px",
          },
        }}
      >
        {/* <DialogTitle>Confirm Delete</DialogTitle> */}
        <DialogContent
          style={{
            backgroundColor: "#FEF2F2",
          }}
        >
          <div className="my-2 p-3 flex flex-col justify-center items-center gap-6">
            <img src={Danger} alt="." />
            <h2 className="text-2xl font-semibold text-gray-700">
              Are you sure?
            </h2>
            <div className="text-center">
              <p>
                This action will delete the{" "}
                <strong className="hover:underline">
                  {fileName.split("_TS=")[0]}
                </strong>{" "}
                file.
              </p>
              <p>You won't be able to revert this action!</p>
            </div>

            <div className="flex flex-row justify-center items-center gap-2">
              <button
                className="px-4 py-1 rounded-lg shadow-sm bg-red-500 text-white"
                onClick={handleDelete}
              >
                Confirm
              </button>
              <button
                className="px-4 py-1 mx-2 rounded-lg shadow-sm border border-gray-300"
                onClick={closeDialog}
                color="primary"
              >
                Cancel
              </button>
            </div>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
              >
                {snackbarMessage}
              </MuiAlert>
            </Snackbar>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteFileConfirmation;
