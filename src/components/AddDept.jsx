import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chrome from "@uiw/react-color-chrome";
import { GithubPlacement } from "@uiw/react-color-github";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const AddDept = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [deptName, setDeptName] = useState("");
  const [hex, setHex] = useState("#4F46E5");

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const addDepartment = async () => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));

      let body = {
        name: deptName,
        metadata: {
          bg: hex,
          border: "#B7B6C2",
        },
      };

      let addDept = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/dept/createDepts`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      // console.log("add dept:", addDept);
      closeDialog();
    } catch (error) {
      console.log("error occurew while adding dept", error);
    }
  };

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="bg-[#5E5ADB] text-white text-sm rounded-lg py-2 px-3"
      >
        Add New Department
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
        <DialogTitle>New Department</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] py-2">
            <span className="w-[462px]">
              <p className="text-gray-700">Department Name</p>
              <input
                className="w-full border border-gray-300 rounded-md my-2 px-2 py-1"
                type="text"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
              />
            </span>

            <span>
              <p className="text-gray-700 my-2">Department Color</p>
              <Chrome
                color={hex}
                style={{ width: "100%", margin: "auto" }}
                placement={GithubPlacement.Right}
                onChange={(color) => {
                  setHex(color.hexa);
                }}
              />
            </span>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-2 py-1 mx-2 rounded-lg shadow-sm border border-gray-300"
            onClick={closeDialog}
            color="primary"
          >
            Cancel
          </button>
          <button
            className="px-2 py-1 rounded-lg shadow-sm bg-[#5E5ADB] text-white"
            onClick={addDepartment}
          >
            Add new department
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddDept;
