import React, { useState, useEffect, useContext } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Edit from "../assets/edit.svg";
import Cross from "../assets/cross.svg";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext";
import secureLocalStorage from "react-secure-storage";
import toast, { Toaster } from "react-hot-toast";
import DepartmentContext from "../context/departmentContext";
import { api } from "../utils/axios-instance";

export default function UserManagementTable() {
  const context = useContext(userContext);
  const {
    setUsers,
    filteredUsers,
    setFilteredUsers,
    userTypes,
    setUserTypes,
    activeType,
    setActiveType,
    applyFilter,
  } = context;
  const navigate = useNavigate();
  const { departments } = useContext(DepartmentContext);

  useEffect(() => {
    const listUsers = async () => {
      try {
        const response = await api.get(`/users/list_users`);

        setUsers(response.data);

        const updatedUsers = replaceDeptIdWithName(response.data, departments);

        setFilteredUsers(updatedUsers);
        let x = ["all", ...new Set(response.data.map((i) => i.role_priv))];
        setUserTypes(x);
        setActiveType("all");
        console.log("users:", response.data);
      } catch (error) {
        console.log(error);
      }
    };

    listUsers();
  }, []);

  const replaceDeptIdWithName = (users, departments) => {
    // Create a map from department IDs to department names
    const deptMap = departments.reduce((acc, dept) => {
      acc[dept.id] = dept.name;
      return acc;
    }, {});

    // Replace each user's dept ID with the department name
    return users.map((user) => {
      return {
        ...user,
        dept: deptMap[user.dept] || user.dept, // If dept ID is not found in map, keep the original ID
      };
    });
  };

  const handleEditClick = (params) => {
    // console.log("Edit clicked for user:", params.row);

    // Navigate to the "user-profile" route with the user ID or any relevant parameter
    navigate(`/user-profile/${params.row.id}`);
  };

  const handleRemoveUserClick = async (params) => {
    try {
      let id = params.row.id;
      console.log(id);
      const response = await api.delete(`/users/deleteUser/${id}/`);

      // console.log("User deleted successfully ", response);
      toast.success("User deleted successfully.");
    } catch (error) {
      console.log("error occured  while deleting user ", error);
      toast.error("Something went wrong.");
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      renderCell: (params) => (
        <div className="flex items-center">
          <Tooltip title={params.row.email} arrow>
            <Avatar
              src={params.row.profilePictureUrl}
              alt={`${params.row.name} ${params.row.last_name}`}
              sx={{
                marginRight: 1,
                width: "30px",
                height: "30px",
                borderRadius: "25%",
              }}
              variant="rounded"
            />
          </Tooltip>
          {`${params.row.name} ${params.row.last_name || ""}`}
        </div>
      ),
    },
    { field: "dept", headerName: "Department", width: 200 },
    { field: "role_priv", headerName: "Roles", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      valueGetter: (params) => (params.row.is_active ? "Online" : "Offline"),
      renderCell: (params) => (
        <p
          className={`text-center rounded-full py-1 px-4 ${
            params.row.is_active
              ? "text-green-700 bg-[#ECFDF3]"
              : "text-red-500 bg-red-50"
          }`}
        >
          {params.row.is_active ? "Online" : "Offline"}
        </p>
      ),
    },

    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      renderCell: (params) => (
        <img
          src={Edit}
          alt="edit"
          style={{ cursor: "pointer" }}
          onClick={() => handleEditClick(params)}
        />
      ),
    },
    {
      field: "removeUser",
      headerName: "Remove",
      width: 80,
      renderCell: (params) => (
        <img
          src={Cross}
          alt="X"
          style={{ cursor: "pointer" }}
          onClick={() => handleRemoveUserClick(params)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-start p-2 gap-3">
        <Toaster position="bottom-left" reverseOrder={false} />
        {userTypes.map((usr, index) => {
          return (
            <span
              key={index}
              className={`capitalize text-base cursor-pointer ${
                usr === activeType
                  ? "text-[#0070FF] font-semibold underline underline-offset-8 decoration-[#0070FF]"
                  : "text-[#7D8398] font-normal"
              }`}
              onClick={() => applyFilter(usr)}
            >
              &nbsp;&nbsp;{usr}&nbsp;&nbsp;
            </span>
          );
        })}
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          sx={{ borderLeft: "none", borderRight: "none" }}
          rows={filteredUsers}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          pagination
          slots={{ toolbar: GridToolbar }}
          componentsProps={{
            panel: {
              sx: {
                "& .MuiTypography-root": {
                  color: "dodgerblue",
                  fontSize: 20,
                },
                ".MuiNativeSelect-select": {
                  paddingLeft: "8px",
                  cursor: "pointer",
                },
                ".MuiInput-input": {
                  paddingLeft: "8px",
                },
              },
            },
            toolbar: {
              sx: {
                py: 1,
                display: "flex",
                gap: 2,
                alignItems: "center",
                ".MuiButtonBase-root": {
                  // border: "1px solid black",
                  color: "black",
                },
              },
            },
          }}
        />
      </div>
    </>
  );
}
