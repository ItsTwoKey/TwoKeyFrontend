import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import secureLocalStorage from "react-secure-storage";
import toast, { Toaster } from "react-hot-toast";

const Lobby = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const departments = JSON.parse(secureLocalStorage.getItem("departments"));
  console.log(departments);

  useEffect(() => {
    const listUsers = async () => {
      try {
        let token = JSON.parse(secureLocalStorage.getItem("token"));
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/users/list_users`,
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        setUsers(response.data);
        // Filter out users where is_approved is false
        const filteredUsers = response.data.filter((user) => !user.is_approved);
        setFilteredUsers(filteredUsers);

        setLoading(false); // Set loading to false after data fetch
      } catch (error) {
        console.log(error);
      }
    };

    listUsers();
  }, []);

  // Group users by department
  const groupedUsers = filteredUsers.reduce((acc, user) => {
    const department = user.dept || "Other";
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(user);
    return acc;
  }, {});

  const handleRemoveUserClick = async (params) => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));
      let id = params.row.id;
      console.log(id);
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/deleteUser/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      // console.log("User deleted successfully ", response);
      toast.success("User deleted successfully.");
    } catch (error) {
      console.log("error occured  while deleting user ", error);
      toast.error("Something went wrong.");
    }
  };

  const acceptUser = async (params) => {
    let token = JSON.parse(secureLocalStorage.getItem("token"));
    console.log(params.row.id);
    try {
      if (token) {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/users/elevate/${params.row.id}`,
          {
            // id: params.row.id,
            is_approved: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log(res);
        toast.success("User added successfully.");
      }
    } catch (error) {
      console.log("error occured  while accepting user ", error);
      toast.error("Something went wrong.");
    }
  };

  if (loading) {
    return <div className="text-center my-4">Loading...</div>; // Render loading indicator while fetching data
  }

  if (filteredUsers.length < 1) {
    return <div className="text-center my-4">Nobody's in the lobby.</div>;
  }

  return (
    <div className="p-4">
      <Toaster position="bottom-left" reverseOrder={false} />
      {Object.keys(groupedUsers).map((dept) => {
        const departmentInfo = departments.find((d) => d.name === dept);
        const departmentBgColor = departmentInfo
          ? departmentInfo.metadata.bg
          : "#ffffff";
        const departmentBorderColor = departmentInfo
          ? departmentInfo.metadata.border
          : "#B7B6C2";

        return (
          <div key={dept} style={{ width: "100%" }} className="my-8">
            <h3
              className="font-semibold text-lg mb-2"
              style={
                {
                  // backgroundColor: departmentBgColor,
                  // borderColor: departmentBorderColor,
                }
              }
            >
              <span className="flex flex-row gap-1 items-center">
                <p>{dept}</p>
                <p className="mb-2">.</p>
                <p>{groupedUsers[dept].length}</p>
              </span>
            </h3>
            <DataGrid
              rows={groupedUsers[dept]}
              headerStyle={{ backgroundColor: "blue" }}
              columns={[
                {
                  field: "name",
                  headerName: "Name",
                  width: 150,
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
                  headerClassName: "custom-header",
                },
                {
                  field: "email",
                  headerName: "Email",
                  width: 250,
                  headerClassName: "custom-header",
                },
                {
                  field: "role_priv",
                  headerName: "Designation",
                  width: 150,
                  headerClassName: "custom-header",
                },
                {
                  field: "action",
                  headerName: "Action",
                  width: 200,
                  renderCell: (params) => (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => acceptUser(params)}
                        className="py-2 px-4 rounded-lg border shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRemoveUserClick(params)}
                        className="py-2 px-4 rounded-lg shadow-sm bg-red-700 text-white"
                      >
                        Revoke
                      </button>
                    </div>
                  ),
                  headerClassName: "custom-header",
                },
              ]}
              pageSize={5}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Lobby;
