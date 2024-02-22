import React, { useState, useEffect } from "react";
import AddDept from "./AddDept";
import ThreeDots from "../assets/threedots.svg";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { Menu, MenuItem } from "@mui/material";

let departments = [
  { name: "Account", metadata: { bg: "#FFF6F6", border: "#FEB7B7" } },
  { name: "Finance", metadata: { bg: "#FFF6FF", border: "#FFA9FF" } },
  { name: "Development", metadata: { bg: "#F6FFF6", border: "#B3FFB3" } },
  { name: "Manufacturing", metadata: { bg: "#F6F7FF", border: "#B6BEFF" } },
  { name: "Sales", metadata: { bg: "#FFFFF6", border: "#FFFFA1" } },
  { name: "Human Resources", metadata: { bg: "#F6FFFE", border: "#C0FFF8" } },
];

const Department = () => {
  const [newDepartments, setNewDepartments] = useState(departments);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    const listDepartments = async () => {
      try {
        let token = JSON.parse(secureLocalStorage.getItem("token"));
        const departments = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/dept/listDepts/`,
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        console.log(departments.data);
        setNewDepartments(departments.data);
      } catch (error) {
        console.log(error);
      }
    };

    listDepartments();
  }, []);

  const handleClick = (event, dept) => {
    setAnchorEl(event.currentTarget);
    setSelectedDept(dept);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveDept = async () => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));
      const deleteDept = await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/dept/deleteDept/${selectedDept.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      setAnchorEl(null);

      console.log(deleteDept);
      // setNewDepartments(departments.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="py-4 px-8">
      <div className="flex justify-between ">
        <h3 className="text-xl font-semibold">Departments</h3>
        <AddDept />
      </div>
      <hr className="border border-white border-b-[#D8DEE4] my-3" />
      <div className="grid grid-cols-3 gap-4">
        {newDepartments.map((dept, index) => (
          <div
            key={index}
            className={`py-4 px-4 rounded-lg flex justify-between `}
            style={{
              backgroundColor: dept.metadata.bg,
              border: `1px solid ${dept.metadata.border}`,
            }}
          >
            <p>{dept.name}</p>
            <button onClick={(e) => handleClick(e, dept)}>
              <img src={ThreeDots} alt="..." className="h-6 cursor-pointer" />
            </button>
          </div>
        ))}
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            border: "1px solid [#11182626]",
            boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)",
            borderRadius: "6px",
          },
        }}
      >
        <MenuItem style={{ padding: "3px 10px" }} onClick={handleRemoveDept}>
          <p className="text-red-500 ">Remove</p>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Department;
