import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CreateFolder from "../CreateFolder";
import FolderImg from "../../assets/folder.png";
import { api } from "../../utils/axios-instance";
import fileContext from "../../context/fileContext";
import { auth } from "../../helper/firebaseClient";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext";
import { useDepartment } from "../../context/departmentContext";
import AddDept from "../AddDept";

function MoveFiles({
  isOpen,
  closeDialog,
  removeMultiSelect,
  removeFiles,
  location,
  deptName,
  listFilesInFolder,
  folderId,
}) {
  const context = useContext(fileContext);
  const { profileData } = useAuth();
  const { departments, listDepartments } = useDepartment();
  const { updateDepartmentFiles } = context;

  const [loading, setLoading] = useState(true);
  const [openMoveDeptOptions, setOpenMoveDeptOptions] = useState(false);
  const [newDept, setNewDept] = useState(null);
  const [folders, setFolders] = useState([]);

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

  const addFileToDepartment = async (file, isMove) => {
    const token = await auth.currentUser.getIdToken();
    try {
      const res = await api.post(`/file/addDepartment/${file?.id}`, {
        department_ids: [newDept?.id],
        idToken: token,
        move: isMove,
      });

      // updateFilesState(value);
    } catch (error) {
      console.log(error);
      // showSnackbar("Error retreiving data", "error");
      toast.error("Error uploading file");
    }
  };

  const handleMoveDepts = async (isMove) => {
    for (const file of context.selectedFiles) {
      await addFileToDepartment(file, isMove);
    }

    toast.success("Files moved successfully!");

    if (deptName) {
      updateDepartmentFiles(deptName);
    }

    if (location === "folder") {
      listFilesInFolder(folderId);
    }

    setOpenMoveDeptOptions(false);
    closeDialog();
    removeMultiSelect();
  };

  useEffect(() => {
    console.log(context.selectedFiles);
    listFolders();
    listDepartments();
  }, []);

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
          }}
        >
          <div className="my-2 p-3 flex flex-col justify-center items-center gap-6">
            <div className="my-4 overflow-x-scroll scrollbar-hide">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-semibold">Folders</h2>
                <CreateFolder listFolders={listFolders} />
              </div>
              <div>
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
              {profileData.role_priv === "employee" ? null : (
                <>
                  <div className="flex flex-row justify-between items-center mt-8">
                    <h2 className="text-2xl font-semibold">Departments</h2>
                    <AddDept />
                  </div>
                  <div>
                    {departments.length === 0 ? (
                      <p className="text-center">No folders found.</p>
                    ) : (
                      <div className="flex flex-wrap">
                        {departments.length &&
                          departments.map((department) => (
                            <div
                              key={department.id}
                              style={{
                                backgroundColor: department.metadata?.bg
                                  ? department.metadata?.bg
                                  : "#fff",
                              }}
                              onClick={() => {
                                setNewDept(department);
                                setOpenMoveDeptOptions(true);
                              }}
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
                                  {department.name}
                                </p>
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openMoveDeptOptions}
        onClose={() => setOpenMoveDeptOptions(false)}
        PaperProps={{
          style: {
            borderRadius: "5px",
            maxWidth: "80%",
            width: "auto",
            maxHeight: "80%",
          },
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent
          style={{
            backgroundColor: "white",
          }}
        >
          <div className="my-2 p-3 flex flex-col justify-center items-center gap-6">
            <div className="flex flex-col">
              <button
                className="py-1 px-4 rounded-md border bg-[#1c4ed8] text-white my-4"
                onClick={() => handleMoveDepts(true)}
              >
                Move Files to Department
              </button>
              <button
                className="py-1 px-4 rounded-md border bg-[#1c4ed8] text-white"
                onClick={() => handleMoveDepts(false)}
              >
                Add Files to Department
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MoveFiles;
