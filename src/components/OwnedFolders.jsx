import React, { useState, useEffect } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import ThreeDots from "../assets/threedots.svg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import toast, { Toaster } from "react-hot-toast";
import FolderImg from "../assets/folder.png";

const OwnedFolders = ({ folders, listFolders }) => {
  const [filesInsideFolder, setFilesInsideFolder] = useState([]);
  const [Folder, setFolder] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
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
      if (response) {
        handleClose();
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
      <div className="grid grid-cols-5 gap-4">
        {folders &&
          folders.map((folder) => (
            <div
              key={folder.id}
              style={{
                backgroundColor: folder.metadata?.bg
                  ? folder.metadata?.bg
                  : "#fff",
              }}
              className=" border rounded-2xl cursor-pointer flex-shrink-0"
            >
              <div>
                <a
                  className="flex justify-center items-center p-4"
                  href={`filesInsideFolder/${folder.name}/${folder.id}`}
                  alt="folder img"
                >
                  <img className="h-24 w-24" src={FolderImg} alt="" />
                </a>
              </div>
              <span className="flex flex-row justify-between items-center ">
                <p className="px-4 py-2 line-clamp-1 font-semibold text-md">
                  {folder.name}
                </p>
                <span>
                  <button
                    className="mx-2"
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
                      <button
                        className="text-red-500"
                        onClick={() => deleteFolder(Folder.id)}
                      >
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
