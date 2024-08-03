import React, { useState, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Danger from "../../assets/danger.svg";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import fileContext from "../../context/fileContext";
import secureLocalStorage from "react-secure-storage";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { api } from "../../utils/axios-instance";
import { useParams } from "react-router-dom";

function DeleteMultiFilesConfirmation({
  isOpen,
  closeDialog,
  closeDeleteDialog,
  removeMultiSelect,
  removeFiles,
}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" or "error"
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const context = useContext(fileContext);
  const { updateDepartmentFiles } = context;
  const { deptName } = useParams();

  const handleDelete = async (file) => {
    let profileData = JSON.parse(secureLocalStorage.getItem("profileData"));
    let token = secureLocalStorage.getItem("token");

    if (profileData.id === file.owner) {
      try {
        const storage = getStorage();
        const fileRef = ref(storage, `files/${profileData.org}/${file.name}`);

        await deleteObject(fileRef);
        await api.delete(`/file/delete-file/${file.id}/`);

        if (deptName) updateDepartmentFiles(deptName);
      } catch (error) {
        throw new Error(
          "Error occurred while deleting the file: " + error.message
        );
      }
    } else {
      throw new Error("You are not the owner of the file.");
    }
  };

  const deleteFiles = async () => {
    try {
      const deletePromises = context.selectedFiles.map((file) =>
        handleDelete(file)
      );
      await Promise.all(deletePromises);

      setSnackbarSeverity("success");
      setSnackbarMessage("Files deleted successfully.");
      setSnackbarOpen(true);

      const newFiles = context.filteredData.filter(
        (file) => !context.selectedFiles.includes(file)
      );
      context.setFilteredData(newFiles);

      if (removeFiles) removeFiles();

      setTimeout(() => {
        closeDialog();
        closeDeleteDialog();
        removeMultiSelect();
      }, 500);
    } catch (error) {
      console.error(error);
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Error deleting files.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className="">
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "5px",
          },
        }}
      >
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
              <p>This action will delete the following files</p>
              <ul className="my-8">
                {context.selectedFiles.map((file) => (
                  <li key={file.id} className="font-bold">
                    {file.name}
                  </li>
                ))}
              </ul>
              <p>You won't be able to revert this action!</p>
            </div>

            <div className="flex flex-row justify-center items-center gap-2">
              <button
                className="px-4 py-1 rounded-lg shadow-sm bg-red-500 text-white"
                onClick={deleteFiles}
              >
                Confirm
              </button>
              <button
                className="px-4 py-1 mx-2 rounded-lg shadow-sm border border-gray-300"
                onClick={() => {
                  closeDeleteDialog();
                  removeMultiSelect();
                }}
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
}

export default DeleteMultiFilesConfirmation;
