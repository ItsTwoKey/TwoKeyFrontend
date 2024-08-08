import React, { useContext, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import fileContext from "../context/fileContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { storage } from "../helper/firebaseClient";
import { ref, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/authContext";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

// Dialogs for options
import MoveFiles from "./dialogs/MoveFiles";
import CopyFiles from "./dialogs/CopyFiles";
import DeleteFiles from "./dialogs/DeleteFiles";

// Icons
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Loader Component
import CircularProgress from "@mui/material/CircularProgress";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function MultipleFileMenu({
  removeMultiSelect,
  removeFiles,
  location,
  addFiles,
  id,
  deptName,
  listFilesInFolder
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMoveDialog, setOpenMoveDialog] = useState(false);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  const context = useContext(fileContext);
  const { profileData } = useAuth();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (action) => {
    switch (action) {
      case "move":
        setOpenMoveDialog(true);
        break;
      case "copy":
        setOpenCopyDialog(true);
        break;
      case "download":
        handleDownload();
        break;
      case "delete":
        setOpenDeleteDialog(true);
        break;
      default:
        console.log("Incorrect action");
    }

    setAnchorEl(null);
  };

  const handleDownload = async () => {
    if (context.selectedFiles.length > 0) {
      setLoading(true); // Show loader

      const zip = new JSZip();
      const folder = zip.folder("Downloaded Files");

      try {
        const downloadPromises = context.selectedFiles.map(async (file) => {
          try {
            const fileRef = ref(
              storage,
              `files/${profileData.org}/${file.id}`
            );
            const downloadURL = await getDownloadURL(fileRef);
            const response = await axios.get(downloadURL, {
              responseType: "arraybuffer",
            });

            const fileBlob = new Blob([response.data], {
              type: file.mimetype,
            });

            folder.file(file.name, fileBlob);
          } catch (error) {
            console.log("Error fetching file:", error);
          }
        });

        await Promise.all(downloadPromises); // Parallel fetching

        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, "ZipFiles");
      } catch (error) {
        console.error("Error generating zip file:", error);
      } finally {
        setLoading(false); // Hide loader
        removeMultiSelect();
        context.setSelectedFiles([]);
      }
    }
  };

  return (
    <div>
      <button
        className="px-4 rounded-md border h-full"
        onClick={handleClick}
        style={{
          backgroundColor: "#1c4ed8",
          color: "white",
        }}
      >
        Options
        <KeyboardArrowDownIcon />
      </button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleClose("move")} disableRipple>
          <DriveFileMoveIcon />
          Move
        </MenuItem>
        <MenuItem onClick={() => handleClose("copy")} disableRipple>
          <FileCopyIcon />
          Copy
        </MenuItem>
        <MenuItem onClick={() => handleClose("download")} disableRipple>
          <DownloadIcon />
          Download
        </MenuItem>
        <MenuItem onClick={() => handleClose("delete")} disableRipple>
          <DeleteIcon />
          Delete
        </MenuItem>
      </StyledMenu>

      {openMoveDialog && (
        <MoveFiles
          isOpen={openMoveDialog}
          closeDialog={() => {
            setOpenMoveDialog(false);
            context.setSelectedFiles([]);
          }}
          removeMultiSelect={removeMultiSelect}
          removeFiles={removeFiles}
          location={location}
          deptName={deptName}
          listFilesInFolder={listFilesInFolder}
          folderId={id}
        />
      )}

      {openCopyDialog && (
        <CopyFiles
          isOpen={openCopyDialog}
          closeDialog={() => {
            setOpenCopyDialog(false);
          }}
          location={location}
          removeMultiSelect={removeMultiSelect}
          openMove={() => setOpenMoveDialog(true)}
          addFiles={addFiles}
          folderId={id}
          deptName={deptName}
        />
      )}

      {openDeleteDialog && (
        <DeleteFiles
          isOpen={openDeleteDialog}
          closeDialog={() => {
            setOpenDeleteDialog(false);
            context.setSelectedFiles([]);
          }}
          removeMultiSelect={removeMultiSelect}
          removeFiles={removeFiles}
        />
      )}

      {loading && (
        <Dialog
          open={loading}
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
          <DialogContent className="bg-white">
            <div className="loader-overlay flex flex-col items-center justify-center">
              <CircularProgress className="mb-5" />
              <p>Downloading files...</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
