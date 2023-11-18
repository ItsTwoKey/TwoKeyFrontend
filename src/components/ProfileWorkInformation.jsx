import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileWorkInformation = ({ profileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [workFormData, setWorkFormData] = useState({
    designation: profileData?.role_priv || "",
    department: profileData?.dept || "",
    manager: profileData?.manager || "",
  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    setWorkFormData({
      designation: profileData?.role_priv || "",
      department: profileData?.dept || "",
      manager: profileData?.manager || "",
    });
  }, [profileData]);

  useEffect(() => {
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

    fetchDepartments();
  }, []);

  const updateProfile = async () => {
    let token = JSON.parse(sessionStorage.getItem("token"));
    if (token) {
      const res = await axios.put(
        "https://twokeybackend.onrender.com/users/updateProfile/",
        {
          id: token.user.id,
          role_priv: workFormData.designation,
          dept: workFormData.department,
          // manager: workFormData.manager,
        },
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      localStorage.setItem("profileData", JSON.stringify(res.data));
    }
  };

  const toggleEditing = () => {
    if (isEditing) {
      updateProfile();
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkFormData({
      ...workFormData,
      [name]: value,
    });
  };

  return (
    <div className="p-4 my-4 border-2 border-gray-200 w-full rounded-xl">
      <h2 className="text-lg font-bold p-2">Work Information</h2>
      <div className="flex flex-row justify-between items-center">
        <div className="grid grid-cols-2 gap-4">
          <span>
            <h5 className="px-2 font-semibold">Designation</h5>
            <input
              name="designation"
              value={workFormData.designation}
              onChange={handleInputChange}
              className={`text-md  placeholder-gray-500 p-2 rounded-md ${
                isEditing ? "bg-white shadow-lg border" : "bg-inherit"
              }`}
              placeholder="Designation"
              disabled={!isEditing}
            />
          </span>
          <span>
            <h5 className="px-2 font-semibold">Department</h5>
            {isEditing ? (
              <select
                name="department"
                value={workFormData.department}
                onChange={handleInputChange}
                className={`text-md  placeholder-gray-500 p-2 rounded-md ${
                  isEditing ? "bg-white shadow-lg border" : "bg-inherit"
                }`}
                disabled={!isEditing}
              >
                <option value="" disabled>
                  Select Department
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="department"
                className={`text-md  placeholder-gray-500 p-2 rounded-md ${
                  isEditing ? "bg-white shadow-lg border" : "bg-inherit"
                }`}
                placeholder={profileData.dept}
                disabled={!isEditing}
              />
            )}
          </span>
          <span>
            <h5 className="px-2 font-semibold">Manager</h5>
            <input
              name="manager"
              value={workFormData.manager}
              onChange={handleInputChange}
              className={`text-md  placeholder-gray-500 p-2 rounded-md ${
                isEditing ? "bg-white shadow-lg border" : "bg-inherit"
              }`}
              placeholder="Manager"
              disabled={!isEditing}
            />
          </span>
        </div>
        <button
          onClick={toggleEditing}
          className={`px-4 py-1 text-sm border-2 rounded-md ${
            isEditing ? "bg-blue-700 text-white" : "bg-white"
          }`}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default ProfileWorkInformation;
