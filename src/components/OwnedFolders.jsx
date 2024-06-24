import React, { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import ThreeDots from "../assets/threedots.svg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import toast, { Toaster } from "react-hot-toast";
import FolderImg from "../assets/folder.png";
import { Link } from "react-router-dom";
import { api } from "../utils/axios-instance";

const OwnedFolders = ({ folders, listFolders }) => {
  const [filesInsideFolder, setFilesInsideFolder] = useState([]);
  const [Folder, setFolder] = useState({});
  const [anchorEls, setAnchorEls] = useState({}); // Separate state for anchorEls

  const handleMenuClick = (event, folder) => {
    setAnchorEls((prevAnchorEls) => ({
      ...prevAnchorEls,
      [folder.id]: event.currentTarget,
    }));
    setFolder(folder);
  };

  const handleClose = (folderId) => {
    setAnchorEls((prevAnchorEls) => ({
      ...prevAnchorEls,
      [folderId]: null,
    }));
  };

  const deleteFolder = async (folder_id) => {
    try {
      const response = await api.delete(`/file/folder/${folder_id}`);
      if (response.status === 204) {
        handleClose(folder_id);
        toast.success("Folder deleted successfully.");
        listFolders();
      }
    } catch (error) {
      console.log("error occured while deleting folder.", error);
      toast.error("Error occurred while deleting the folder");
    }
  };

  return (
    <div className="mt-2">
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="flex overflow-x-auto">
        {folders &&
          folders.map((folder) => (
            <div
              key={folder.id}
              style={{
                backgroundColor: folder.metadata?.bg
                  ? folder.metadata?.bg
                  : "#fff",
              }}
              className="border rounded-2xl cursor-pointer flex-shrink-0 mr-4"
            >
              <div>
                <Link
                  className="flex justify-center items-center py-4 px-8"
                  to={`/filesInsideFolder/${folder.name}/${folder.id}`}
                >
                  <img alt="folder img" className="h-24 w-24" src={FolderImg} />
                </Link>
              </div>
              <span className="flex flex-row justify-between items-center line-clamp-1 ">
                <p className="px-4 pb-2 line-clamp-1 font-semibold text-md">
                  {folder.name}
                </p>
                <span>
                  <button
                    className="mx-2"
                    onClick={(event) => handleMenuClick(event, folder)}
                  >
                    <img src={ThreeDots} height={25} width={25} alt="" />
                  </button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEls[folder.id]}
                    open={Boolean(anchorEls[folder.id])}
                    onClose={() => handleClose(folder.id)}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    PaperProps={{
                      style: {
                        border: "1px solid [#11182626]",
                        boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)",
                        borderRadius: "6px",
                      },
                    }}
                  >
                    <MenuItem style={{ padding: "0px 10px" }}>
                      <button
                        className="text-red-500"
                        onClick={() => deleteFolder(folder.id)}
                      >
                        Delete
                      </button>
                    </MenuItem>
                  </Menu>
                </span>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OwnedFolders;
