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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import Trash from "../assets/trash.svg";

export default function TeamManagementTable() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const listUsers = async () => {
      try {
        let token = JSON.parse(sessionStorage.getItem("token"));
        const users = await axios.get(
          "https://twokeybackend.onrender.com/users/list_users/",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log("users :", users.data);
        setUsers(users.data);
      } catch (error) {
        console.log(error);
      }
    };

    listUsers();
  }, []);

  useEffect(() => {
    const getRoles = async () => {
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

    getRoles();
  }, []);

  const columns = [
    { id: "name", label: "Team Member", minWidth: 170 },
    { id: "status", label: "Status", minWidth: 60 },
    { id: "dateAdded", label: "Date Added", minWidth: 100 },
    { id: "lastActivity", label: "Last Activity", minWidth: 100 },
    { id: "access", label: "Access", minWidth: 100 },
    { id: "delete", label: "", minWidth: 10 },
  ];

  function createData(data) {
    return {
      id: data.id,
      name: data.name + " " + data.last_name,
      status: "Active",
      dateAdded: "11/11/2023",
      lastActivity: "11/11/2023",
      profile_pic: data.profile_pic,
      email: data.email,
      access: data.role_priv,
      delete: <img src={Trash} alt="Delete" className="cursor-pointer" />,
    };
  }

  const rows = users.map((user) => createData(user));

  const handleAccessChange = async (event, index) => {
    const newUsers = [...users];
    newUsers[index].role_priv = event.target.value;
    setUsers(newUsers);

    const selectedUserId = newUsers[index].id; // Extract the user's ID
    const selectedUserName = newUsers[index].name;
    const selectedRoleId = event.target.value;

    // Find the selected role in the roles array
    const selectedRole = roles.find((role) => role.role === selectedRoleId);

    console.log(
      `User ID: ${selectedUserId}, User: ${selectedUserName}, Selected Role: ${selectedRole?.role}, Selected Role ID: ${selectedRole?.id}`
    );

    // Call elevateUserRole function
    await elevateUserRole(selectedUserId, selectedRole?.role);
  };

  const elevateUserRole = async (selectedUserId, selectedRole) => {
    let token = JSON.parse(sessionStorage.getItem("token"));
    if (token) {
      try {
        const res = await axios.put(
          `https://twokeybackend.onrender.com/users/elevate/${selectedUserId}`,
          {
            role_priv: selectedRole,
          },
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log("elevate user:", res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteClick = (index) => {
    const deletedUserName = users[index].name;
    console.log(`User deleted: ${deletedUserName}`);
    // Add logic to handle the deletion if needed
  };

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
            {rows.map((row, index) => (
              <TableRow key={index}>
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
                    ) : column.id === "access" ? (
                      <Select
                        value={row.access}
                        label="Access"
                        onChange={(event) => handleAccessChange(event, index)}
                        className="w-36"
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.role}>
                            {role.role}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : column.id === "delete" ? (
                      <div
                        className="cursor-pointer"
                        onClick={() => handleDeleteClick(index)}
                      >
                        {row[column.id]}
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
