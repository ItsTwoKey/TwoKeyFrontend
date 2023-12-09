import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfilePicDummy from "../assets/profilePicDummy.jpg";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const UserProfile = () => {
  const [userProfileData, setUserProfileData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      let token = JSON.parse(sessionStorage.getItem("token"));
      try {
        const user = await axios.get(
          "https://twokeybackend.onrender.com/users/getUserInfo/a1a3d4ac-9574-4791-9148-3c1583b1fd20/",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        // console.log(user.data.user_info);
        setUserProfileData(user.data.user_info);
        setSelectedRole(user.data.user_info.role_priv);
        setSelectedDepartment(user.data.user_info.dept);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDepartments = async () => {
      try {
        let token = JSON.parse(sessionStorage.getItem("token"));
        const dep = await axios.get(
          "https://twokeybackend.onrender.com/dept/listDepts/",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        setDepartments(dep.data);
      } catch (error) {
        console.log("Error fetching departments");
      }
    };

    const getRoles = async () => {
      try {
        let token = JSON.parse(sessionStorage.getItem("token"));
        const rolesData = await axios.get(
          "https://twokeybackend.onrender.com/role/listRoles/",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        // console.log("roles", rolesData.data);
        setRoles(rolesData.data);
      } catch (error) {
        console.log("Error fetching roles");
      }
    };

    getUserProfile();
    fetchDepartments();
    getRoles();
  }, []);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  if (!userProfileData) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="p-4 border shadow-lg bg-[#F1F1FF] border-gray-300 w-full rounded-xl ">
        <div className="flex flex-row items-center space-x-4">
          <img
            src={
              userProfileData && userProfileData.profile_pic
                ? userProfileData.profile_pic
                : ProfilePicDummy
            }
            alt="ProfilePic"
            className="rounded-full w-24 h-24"
          />
          <div className="flex flex-col leading-9">
            <h3 className="text-lg font-semibold">
              {userProfileData.username
                ? `#${userProfileData.username}`
                : "UserName"}
            </h3>
            <h5 className="text-md font-semibold text-gray-700">
              {userProfileData.role_priv
                ? userProfileData.role_priv
                : "Position"}
            </h5>
            <p className="text-sm text-gray-500">
              {userProfileData
                ? `${userProfileData.city}, ${userProfileData.state}, ${userProfileData.country}`
                : "Address"}
            </p>
          </div>
        </div>
        <h4 className="my-2 text-lg font-semibold ">Personal Information</h4>
        <div className="grid grid-cols-4 gap-4">
          <span>
            <h5 className="p-2 font-semibold">First Name</h5>
            <input
              name="firstName"
              value={userProfileData.name || ""}
              className={`text-md  placeholder-gray-300 bg-[#464F6029] shadow p-2 rounded-md w-full`}
              placeholder="First Name"
              disabled
            />
          </span>
          <span>
            <h5 className="p-2 font-semibold">Last Name</h5>
            <input
              name="lastName"
              value={userProfileData.last_name || ""}
              className={`text-md  placeholder-gray-500 bg-[#464F6029] shadow p-2 rounded-md w-full`}
              placeholder="Last Name"
              disabled
            />
          </span>
          <span>
            <h5 className="p-2 font-semibold">Email Address</h5>
            <input
              name="email"
              value={userProfileData.email || ""}
              className={`text-md  placeholder-gray-500 bg-[#464F6029] shadow p-2 rounded-md w-full`}
              placeholder="Email Address"
              disabled
            />
          </span>
          <span>
            <h5 className="p-2 font-semibold">Phone Number</h5>
            <input
              name="phone"
              value={userProfileData.phone || ""}
              className={`text-md lining-nums placeholder-gray-500 bg-[#464F6029] shadow p-2 rounded-md w-full`}
              placeholder="9876543210"
              disabled
            />
          </span>
        </div>
        <h4 className="my-2 text-lg font-semibold ">Work Information</h4>
        <div className="grid grid-cols-4 gap-4">
          <span>
            <h5 className="p-2 font-semibold">Department</h5>
            <Select
              value={selectedDepartment || ""}
              label="Department"
              onChange={(event) => handleDepartmentChange(event)}
              className={`w-full ${isEditing ? "bg-[#464F6029]" : "bg-white"}`}
              sx={{ borderRadius: "6px" }}
              size="small"
              disabled={isEditing}
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.name}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </span>

          <span>
            <h5 className="p-2 font-semibold">Role</h5>
            <Select
              value={selectedRole || ""}
              label="Role"
              onChange={(event) => handleRoleChange(event)}
              className={`w-full ${isEditing ? "bg-[#464F6029]" : "bg-white"}`}
              sx={{ borderRadius: "6px" }}
              size="small"
              disabled={isEditing}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.role}>
                  {role.role}
                </MenuItem>
              ))}
            </Select>
          </span>

          <button onClick={toggleEditing}>toggle</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
