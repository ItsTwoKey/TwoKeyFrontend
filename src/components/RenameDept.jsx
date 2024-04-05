import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";

const RenameDept = ({ id, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deptName, setDeptName] = useState("");

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleDepartmentNameChange = async () => {
    let body = {
      name: deptName,
    };
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));

      let renameDept = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/dept/updateDept/${id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      console.log(renameDept);
    } catch (error) {
      console.log("error occured at rename department.", error);
    }
  };

  return (
    <div className="">
      <button onClick={openDialog} className="text-sm">
        Rename
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
        <DialogTitle>Rename Department</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] p-3">
            <p className="text-sm">
              Current department name :{" "}
              <span className="text-lg text-purple-600">
                {name ? name : "No name provided"}
              </span>
            </p>
            {/* <p>id: {id ? id : "No ID provided"}</p> */}
            <p>New name :</p>
            <input
              className="w-full border border-gray-300 rounded-md my-2 px-2 py-1"
              type="text"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-2 py-1 mx-2 rounded-lg shadow-sm border border-gray-300"
            onClick={closeDialog}
            color="primary"
          >
            Close
          </button>
          <button
            className="px-2 py-1 rounded-lg shadow-sm bg-[#5E5ADB] text-white"
            onClick={handleDepartmentNameChange}
            // disabled={!deptName.length}
          >
            Rename Department
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RenameDept;
