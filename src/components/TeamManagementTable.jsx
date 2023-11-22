import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";

const columns = [
  { id: "name", label: "Team Member", minWidth: 170 },
  { id: "dept", label: "Department", minWidth: 170 },
  { id: "access", label: "Access", minWidth: 100 },
];

function createData(data) {
  return {
    name: data.name + " " + data.last_name,
    dept: data.dept,
    profile_pic: data.profile_pic,
    email: data.email,
    access: data.role_priv,
  };
}

const userData = {
  id: "a1a3d4ac-9574-4791-9148-3c1583b1fd20",
  manager: null,
  role_priv: "employee",
  is_approved: true,
  username: "SuperAkash",
  email: "trimbakeakash19@gmail.com",
  name: "Akash",
  last_name: "Trimbake",
  dept: "Marketing",
  profile_pic:
    "https://dxqrkmzagreeiyncplzx.supabase.co/storage/v1/object/public/avatar/trimbakeakash19@gmail.com",
};

const rows = [createData(userData)];

export default function UserInfoTable() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const depData = async () => {
      try {
        let token = JSON.parse(sessionStorage.getItem("token"));
        const role = await axios.get(
          "https://twokeybackend.onrender.com/role/listRoles/",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log("roles:", role.data);
        setRoles(role.data);
      } catch (error) {
        console.log("Error fetching departments");
      }
    };

    depData();
  }, []);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={column.id} align="left">
                    {column.id === "name" ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Tooltip title={row.email} arrow>
                          <Avatar
                            alt={row.name}
                            src={row.profile_pic}
                            sx={{
                              marginRight: 1,
                              width: "30px",
                              height: "30px",
                              borderRadius: "25%",
                            }}
                            variant="rounded"
                          />
                        </Tooltip>
                        {row.name}
                      </div>
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
