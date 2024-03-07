import React, { useState, useEffect } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import FolderImg from "../assets/folder.svg";
import ThreeDots from "../assets/threedots.svg";
import CreateFolder from "./CreateFolder";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FilesInsideFolder from "../components/FilesInsideFolder";

const OwnedFolders = ({ folders }) => {
  const [filesInsideFolder, setFilesInsideFolder] = useState([]);
  const [Folder, setFolder] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    // console.log("fileName", fileName);
  };

  const listFilesInFolder = async (folder_id) => {
    let token = JSON.parse(secureLocalStorage.getItem("token"));
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/folder/listFiles/${folder_id}`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log("files", response.data);
      setFilesInsideFolder(response.data);
    } catch (error) {
      console.log("error occured while fetching files inside folders", error);
    }
  };

  const deleteFolder = async (folder_id) => {
    let token = JSON.parse(secureLocalStorage.getItem("token"));
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/folder/${folder_id}`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log("deleted folder", response);

      if (response) {
        handleClose();
      }
    } catch (error) {
      console.log("error occured while deleting folder.", error);
    }
  };

  return (
    <div className="mt-2">
      <div className="py-2">
        <CreateFolder />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="w-full border rounded-2xl cursor-pointer"
          >
            <div onClick={() => listFilesInFolder(folder.id)}>
              {/* <img src={FolderImg} alt="" /> */}
              <FilesInsideFolder
                folderName={folder.name}
                files={filesInsideFolder}
              />
            </div>
            <span className="flex flex-row justify-between items-center ">
              <p className="px-4 py-2 line-clamp-1 font-semibold text-md">
                {folder.name}
              </p>
              <span>
                <button
                  className=""
                  onClick={(event) => {
                    handleMenuClick(event);
                    setFolder(folder);
                  }}
                >
                  <img src={ThreeDots} height={25} width={25} alt="" />
                </button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
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
                    <button onClick={() => deleteFolder(Folder.id)}>
                      delete
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
