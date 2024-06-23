import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Trash from "../assets/trash.svg";
import secureLocalStorage from "react-secure-storage";
import { api } from "../utils/axios-instance";

export default function TeamManagementTable() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const listUsers = async () => {
      try {
        const users = await api.get(`/users/list_users`);
        // console.log("users :", users.data);
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
        console.log("Fetching roles");
        const role = await api.get(`/role/listRoles`);
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

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  function createData(data) {
    return {
      id: data.id,
      name: data.name + " " + data.last_name,
      status: (
        <p
          className={`text-center rounded-full py-1 px-4 ${
            data.is_active
              ? "text-green-700 bg-[#ECFDF3]"
              : "text-red-500 bg-red-50"
          }`}
        >
          {data.is_active ? "Online" : "Offline"}
        </p>
      ),
      dateAdded: formatDate(data.created_at),
      lastActivity: formatDate(data.last_sign_in_at),
      profile_pic: data.profile_pic,
      email: data.email,
      access: data.role_priv,
      delete: <img src={Trash} alt="Delete" className="cursor-pointer" />,
      profilePictureUrl: data.profilePictureUrl,
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
    try {
      const res = await api.patch(`/users/elevate/${selectedUserId}`, {
        role_priv: selectedRole,
      });
      console.log("elevate user:", res);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (index) => {
    const deletedUserId = users[index].id;
    console.log(`User deleted: ${deletedUserId}`);
    try {
      const res = await api.delete(`/users/deleteUser/${deletedUserId}`);
      console.log("delete user:", res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                  sx={{ backgroundColor: "#FCFCFD" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ padding: "0px", margin: "0px", height: "20px" }}>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="left"
                    sx={{ padding: "7px" }}
                  >
                    {column.id === "name" ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Tooltip title={row.email} arrow>
                          <Avatar
                            alt={row.name}
                            src={row.profilePictureUrl}
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
                        className="w-36 h-8"
                        sx={{ borderRadius: "6px" }}
                        size="small"
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
                        onClick={() => deleteUser(index)}
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
    </div>
  );
}
