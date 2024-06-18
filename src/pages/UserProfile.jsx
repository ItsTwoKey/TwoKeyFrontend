import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfilePicDummy from "../assets/profilePicDummy.jpg";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ProfileTabsOfUser from "../components/ProfileTabsOfUser";
import { useParams } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import toast, { Toaster } from "react-hot-toast";

const UserProfile = () => {
  const { userId } = useParams(); // Use useParams to get the user ID from the route parameters
  const [userProfileData, setUserProfileData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deptKeys, setDeptKeys] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      let token = secureLocalStorage.getItem("token");
      try {
        const user = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/users/getUserInfo/${userId}/`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setUserProfileData(user.data.user_info);
        setSelectedRole(user.data.user_info.role_priv);
        setSelectedDepartment(user.data.user_info.dept);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong.");
      }
    };

    const fetchDepartments = async () => {
      try {
        let token = secureLocalStorage.getItem("token");
        const dep = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/dept/listDepts`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setDepartments(dep.data);
        let deptobj = {};
        for (const i of dep.data) {
          deptobj[i.name] = i;
        }
        setDeptKeys(deptobj);
      } catch (error) {
        console.log("Error fetching departments");
        toast.error("Something went wrong.");
      }
    };

    const getRoles = async () => {
      try {
        let token = secureLocalStorage.getItem("token");
        const rolesData = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/role/listRoles`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setRoles(rolesData.data);
      } catch (error) {
        console.log("Error fetching roles");
        toast.error("Something went wrong while fetching roles.");
      }
    };

    getUserProfile();
    fetchDepartments();
    getRoles();
  }, [userId]);

  const elevateUserRole = async (selectedRole) => {
    let token = secureLocalStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.patch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/users/elevate/${userProfileData.id}`,
          {
            role_priv: selectedRole,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        // console.log("elevate user successful");
        toast.success("Elevate user successful");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong.");
      }
    }
  };

  const changeDept = async (selectedDepartment) => {
    let token = secureLocalStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.patch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/users/elevate/${userProfileData.id}`,
          {
            dept: selectedDepartment,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        // console.log("User's dept changed");
        toast.success("User's dept changed");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong.");
      }
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    elevateUserRole(event.target.value);
  };

  const handleDepartmentChange = (val) => {
    setSelectedDepartment(val);
    changeDept(deptKeys[val].id);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  if (!userProfileData) {
    return null;
  }

  return (
    <div className="p-4">
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="p-4 border shadow-lg bg-[#F1F1FF] border-gray-300 w-full rounded-xl ">
        <div className="flex flex-row items-center space-x-4">
          <img
            src={
              userProfileData && userProfileData.profilePictureUrl
                ? userProfileData.profilePictureUrl
                : ProfilePicDummy
            }
            alt="ProfilePic"
            className="rounded-full w-24 h-24 object-cover"
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
              placeholder=""
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
              onChange={(event) => {
                handleDepartmentChange(event.target.value);
              }}
              className={`w-full ${isEditing ? "bg-[#464F6029]" : "bg-white"}`}
              sx={{ borderRadius: "6px" }}
              size="small"
              disabled={isEditing}
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.name}>
                  <span
                    className="w-4 h-4 rounded-full inline-block mr-2"
                    style={{ backgroundColor: department?.metadata?.bg }}
                  ></span>
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

          {/* <button onClick={toggleEditing}>toggle</button> */}
        </div>
      </div>
      <div className="pt-4">
        <ProfileTabsOfUser />
      </div>
    </div>
  );
};

export default UserProfile;
