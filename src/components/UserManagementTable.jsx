import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

export default function UserManagementTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const listUsers = async () => {
      try {
        let token = JSON.parse(sessionStorage.getItem("token"));
        const response = await axios.get(
          "https://twokeybackend.onrender.com/users/list_users/",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        // console.log("users :", response.data);

        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    listUsers();
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
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
    { field: "role_priv", headerName: "Role", width: 150 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        sx={{ borderLeft: "none", borderRight: "none" }}
        rows={users}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        pagination
      />
    </div>
  );
}
