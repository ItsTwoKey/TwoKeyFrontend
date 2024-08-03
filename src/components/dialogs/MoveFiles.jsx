import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CreateFolder from "../CreateFolder";
import FolderImg from "../../assets/folder.png";
import { api } from "../../utils/axios-instance";
import fileContext from "../../context/fileContext";
import { auth } from "../../helper/firebaseClient";
import toast from "react-hot-toast";

function MoveFiles({
  isOpen,
  closeDialog,
  removeMultiSelect,
  removeFiles,
  location,
}) {
  const context = useContext(fileContext);
  const [loading, setLoading] = useState(true);

  const addFile = async (file, folder) => {
    const token = await auth.currentUser.getIdToken();
    let body = { file_id: file?.id, idToken: token };
    try {
      const response = await api.post(
        `/file/folder/addFile/${folder?.id}`,
        body
      );
      return response;
    } catch (error) {
      console.log("error occurred while creating folder.", error);
      toast.error("Error adding the file.");
    }
  };

  const handleAdd = (folder) => {
    let res = [];
    for (const file of context.selectedFiles) {
      res.push(addFile(file, folder));
    }

    if (res.length === context.selectedFiles.length) {
      toast.success("Files added successfully.");
      closeDialog();
      removeMultiSelect();
      if (removeFiles) removeFiles();
      context.setSelectedFiles([]);
    }
  };

  const listFolders = async () => {
    setLoading(true); // Set loading to true when fetching starts

    try {
      const response = await api.get(`/file/folder`);
      context.setFolders(response.data);
    } catch (error) {
      console.log("error occurred while fetching folders", error);
    }

    setLoading(false); // Set loading to false after fetching completes
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "5px",
            maxWidth: "80%",
            width: "auto",
            maxHeight: "80%",
          },
        }}
        maxWidth="lg" // Control the maxWidth of the dialog
        fullWidth // Make the dialog take up the full width of its container
      >
        <DialogContent
          style={{
            backgroundColor: "white",
            // width: "100%", // Set the width of the DialogContent
          }}
        >
          <div className="my-2 p-3 flex flex-col justify-center items-center gap-6">
            <div className="my-4 overflow-x-scroll scrollbar-hide">
              {location === "department" ? (
                <div>
                  <h2 className="text-2xl font-semibold">Departments</h2>
                </div>
              ) : (
                <div className="flex flex-row justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Folders</h2>
                  <CreateFolder listFolders={listFolders} />
                </div>
              )}
              <div className="my-2">
                {context.folders.length === 0 ? (
                  <p className="text-center">No folders found.</p>
                ) : (
                  <div className="flex flex-wrap">
                    {context.folders &&
                      context.folders.map((folder) => (
                        <div
                          key={folder.id}
                          style={{
                            backgroundColor: folder.metadata?.bg
                              ? folder.metadata?.bg
                              : "#fff",
                          }}
                          onClick={() => handleAdd(folder)}
                          className="border rounded-2xl cursor-pointer flex-shrink-0 mr-4 flex flex-col items-center px-8 py-4 mt-5"
                        >
                          <div>
                            <img
                              alt="folder img"
                              className="h-24 w-24"
                              src={FolderImg}
                            />
                          </div>
                          <span className="flex flex-row justify-between items-center line-clamp-1 ">
                            <p className="px-4 line-clamp-1 font-semibold text-md">
                              {folder.name}
                            </p>
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MoveFiles;
