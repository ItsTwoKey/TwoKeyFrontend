import React, { useState, useEffect, useContext, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import fileContext from "../../context/fileContext";
import { auth } from "../../helper/firebaseClient";
import { storage } from "../../helper/firebaseClient";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import axios from "axios";
import { api } from "../../utils/axios-instance";
import toast from "react-hot-toast";
import { useAuth } from "../../context/authContext";
import { v4 as uuidv4 } from "uuid";
import { useDepartment } from "../../context/departmentContext";

function CopyFiles({
  isOpen,
  closeDialog,
  removeMultiSelect,
  location,
  openMove,
  addFiles,
  folderId,
}) {
  const { profileData, formatFileSize } = useAuth();
  const { departments } = useDepartment();
  const context = useContext(fileContext);
  const [loading, setLoading] = useState(false);
  const [copiedFiles, setCopiedFiles] = useState([]);
  const [filesCopied, setFilesCopied] = useState(false);

  const addFilesToFolder = useCallback(async () => {
    const token = await auth.currentUser.getIdToken();
    console.log("Adding files to folder with token:", token);
    console.log("COPIED FILES ARE : ", copiedFiles);

    const addPromises = copiedFiles.map(async (file) => {
      let body = { file_id: file.id, idToken: token };
      try {
        const response = await api.post(
          `/file/folder/addFile/${folderId}`,
          body
        );
        console.log("File added response:", response);
        if (response) {
          toast.success("File added successfully.");
        }
      } catch (error) {
        console.log("Error occurred while adding file:", error);
        toast.error("Error adding the file.");
      }
    });

    await Promise.all(addPromises);
  });

  const uploadFile = async (file, metadata) => {
    const fileRef = ref(storage, `files/${profileData.org}/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("File upload error:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  const getUniqueFileName = async (fileName) => {
    let uniqueName = fileName;
    let counter = 1;

    while (true) {
      const fileRef = ref(storage, `files/${profileData.org}/${uniqueName}`);
      try {
        await getDownloadURL(fileRef);
        uniqueName = fileName.replace(/(\.[\w\d_-]+)$/i, ` (${counter++})$1`);
      } catch (error) {
        return uniqueName;
      }
    }
  };

  const createCopyOfFile = async (file) => {
    const deptId = file.dept[0];
    const newFileId = uuidv4();
    let newFile = null;

    try {
      const originalFileRef = ref(
        storage,
        `files/${profileData.org}/${file.name}`
      );
      const downloadURL = await getDownloadURL(originalFileRef);
      const response = await axios.get(downloadURL, {
        responseType: "arraybuffer",
      });

      const originalFileBlob = new Blob([response.data], {
        type: file.mimetype,
      });
      const uniqueFileName = await getUniqueFileName(`Copy of ${file.name}`);

      const copiedFile = new File([originalFileBlob], uniqueFileName, {
        type: file.mimetype,
        lastModified: Date.now(),
      });

      const copiedFileMetadata = {
        customMetadata: {
          department_id: deptId,
          org_id: profileData.org,
        },
      };

      const copiedFileDownloadURL = await uploadFile(
        copiedFile,
        copiedFileMetadata
      );

      const token = await auth.currentUser.getIdToken();
      const res = await api.post(`/file/addDepartment/${newFileId}`, {
        department_ids: [deptId],
        new: true,
        name: copiedFile.name,
        downloadURL: copiedFileDownloadURL,
        idToken: token,
        metadata: {
          size: copiedFile.size,
          mimetype: file.mimetype,
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

      const returnedFile = res?.data?.file;
      const filteredDepartment = departments.filter(
        (dept) => dept.id === returnedFile.department_ids[0]
      );

      newFile = {
        id: returnedFile.id,
        name: returnedFile.name.substring(0, 80),
        profilePic: returnedFile.profile_pic,
        size: formatFileSize(returnedFile.metadata.size),
        dept: returnedFile.department_ids,
        owner: returnedFile.owner_id,
        mimetype: returnedFile.metadata.mimetype,
        status: "Team",
        security: "Enhanced",
        color: filteredDepartment[0]?.metadata.bg,
        downloadUrl: returnedFile.download_url,
        isLocked: returnedFile?.is_locked,
        hasPassword: returnedFile?.has_password,
        password: returnedFile?.password,
        lastUpdate: new Date(returnedFile.metadata.lastModified).toLocaleString(
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
    } catch (error) {
      console.error("Error creating copy of the file:", error);
      toast.error("Error creating copy of the file");
    }

    return newFile;
  };

  const handleCopyFiles = async (location) => {
    setLoading(true);
    try {
      const copyPromises = context.selectedFiles.map(createCopyOfFile);
      const newFiles = await Promise.all(copyPromises);

      console.log("FILES AFTER COPY: ", newFiles);

      if (location === "dashboard") {
        context.setFilteredData((prevData) => [...newFiles, ...prevData]);
        removeMultiSelect();
      } else if (location === "folder") {
        console.log("Setting copied files and filesCopied state");
        setCopiedFiles([...newFiles]);
        setFilesCopied(true);
      }

      toast.success("Files copied successfully");
    } catch (error) {
      console.error("Error during file copy process:", error);
      toast.error("Error copying files");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHere = async () => {
    setLoading(true);
    try {
      await handleCopyFiles(location);

      if (location === "folder") {
        console.log("FILES COPIED STATE: ", filesCopied);
        // if (filesCopied) {
          console.log("Adding files to folder");
          await addFilesToFolder();
          addFiles(copiedFiles);
        // } else {
        //   console.log("FILES COPIED CONDITION NOT MET");
        // }
      }
    } catch (error) {
      console.error("Error handling copy here:", error);
      toast.error("Error handling copy here");
    } finally {
      setLoading(false);
      closeDialog();
      removeMultiSelect();
      context.setSelectedFiles([]);
    }
  };

  useEffect(() => {
    if (isOpen && location === "dashboard") {
      handleCopyFiles(location);
    }
  }, [isOpen, location]);

  useEffect(() => {
    console.log("FILES COPIED STATE CHANGED: ", filesCopied);
    console.log("COPIED FILES STATE: ", copiedFiles);
    
    if (filesCopied && location === "folder") {
      console.log("Triggering addFilesToFolder due to state change");
      addFilesToFolder();
      addFiles(copiedFiles);
    }
  }, [filesCopied, copiedFiles, location, addFiles, addFilesToFolder]);

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
        maxWidth="lg"
        fullWidth
      >
        <DialogContent
          style={{
            backgroundColor: "white",
          }}
        >
          <div className="my-2 p-3 flex flex-col justify-center items-center gap-6">
            {location === "folder" ? (
              <div className="flex flex-col">
                <button
                  className="py-1 px-4 rounded-md border bg-[#1c4ed8] text-white my-4"
                  onClick={handleCopyHere}
                >
                  Copy Here
                </button>
                <button className="py-1 px-4 rounded-md border bg-[#1c4ed8] text-white">
                  Copy to different folder
                </button>
              </div>
            ) : (
              <h1>{loading ? "Copying files..." : "Files copied"}</h1>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CopyFiles;