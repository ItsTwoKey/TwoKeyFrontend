import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Edit from "../assets/edit.svg";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext";
import secureLocalStorage from "react-secure-storage";

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

  useEffect(() => {
    const listUsers = async () => {
      try {
        let token = JSON.parse(secureLocalStorage.getItem("token"));
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/users/list_users/`,
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        setUsers(response.data);
        setFilteredUsers(response.data);
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

  const handleEditClick = (params) => {
    // console.log("Edit clicked for user:", params.row);

    // Navigate to the "user-profile" route with the user ID or any relevant parameter
    navigate(`/user-profile/${params.row.id}`);
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 350,
      renderCell: (params) => (
        <div className="flex items-center">
          <Tooltip title={params.row.email} arrow>
            <Avatar
              src={params.row.profile_pic}
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
    { field: "dept", headerName: "Department", width: 150 },
    { field: "role_priv", headerName: "Roles", width: 250 },
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
      headerName: " ",
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
  ];

  return (
    <>
      <div className="flex justify-start p-2 gap-3">
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
        />
      </div>
    </>
  );
}
