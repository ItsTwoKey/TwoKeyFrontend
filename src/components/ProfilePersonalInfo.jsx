import React, { useEffect, useState } from "react";
import axios from "axios";
import secureLocalStorage from  "react-secure-storage";

const ProfilePersonalInfo = ({ profileData, isEditing }) => {
  const [formData, setFormData] = useState({
    firstName: profileData?.name || "",
    lastName: profileData?.last_name || "",
    email: profileData?.email || "",
    phone: profileData?.phone || "",
    designation: profileData?.role_priv || "",
    department: profileData?.dept || "",
  });

  const [prevIsEditing, setPrevIsEditing] = useState(isEditing);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    setFormData({
      firstName: profileData?.name || "",
      lastName: profileData?.last_name || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
      designation: profileData?.role_priv || "",
      department: profileData?.dept || "",
    });
  }, [profileData]);

  useEffect(() => {
    if (prevIsEditing && !isEditing) {
      const updateProfile = async () => {
        let token = JSON.parse(secureLocalStorage.getItem("token"));

        // Check if the department has changed
        const isDepartmentChanged = formData.department !== profileData.dept;

        // Only include the department in the update if it has changed
        const updateData = {
          id: token.user.id,
          name: formData.firstName,
          last_name: formData.lastName,
          // email: formData.email,
          phone: formData.phone,
          role_priv: formData.designation,
          ...(isDepartmentChanged && { dept: formData.department }), // Include department only if it has changed
        };

        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/users/updateProfile`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        secureLocalStorage.setItem("profileData", JSON.stringify(res.data));
      };

      updateProfile();
    }

    setPrevIsEditing(isEditing);
  }, [isEditing, formData, prevIsEditing]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        let token = JSON.parse(secureLocalStorage.getItem("token"));
        const dep = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/dept/listDepts`,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="p-4 my-4 bg-[#F7F8FA] border shadow-lg border-gray-200 w-full rounded-xl">
      <div className="grid grid-cols-4 gap-4">
        <span>
          <h5 className="px-2 font-semibold">First Name</h5>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`text-md  placeholder-gray-500 p-2 rounded-md ${
              isEditing ? "bg-white shadow-lg border" : "bg-inherit"
            }`}
            placeholder="First Name"
            disabled={!isEditing}
          />
        </span>
        <span>
          <h5 className="px-2 font-semibold">Last Name</h5>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`text-md  placeholder-gray-500 p-2 rounded-md ${
              isEditing ? "bg-white shadow-lg border" : "bg-inherit"
            }`}
            placeholder="Last Name"
            disabled={!isEditing}
          />
        </span>
        <span>
          <h5 className="px-2 font-semibold">Email Address</h5>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`text-md  placeholder-gray-500 p-2 rounded-md ${
              isEditing ? "bg-white shadow-lg border" : "bg-inherit"
            }`}
            placeholder="Email Address"
            disabled={!isEditing}
          />
        </span>
        <span>
          <h5 className="px-2 font-semibold">Phone Number</h5>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`text-md lining-nums placeholder-gray-500 p-2 rounded-md ${
              isEditing ? "bg-white shadow-lg border" : "bg-inherit"
            }`}
            placeholder="9876543210"
            disabled={!isEditing}
          />
        </span>
        <span>
          <h5 className="px-2 font-semibold">Designation</h5>
          <input
            name="designation"
            value={formData.designation}
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
              value={formData.department}
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
      </div>
    </div>
  );
};

export default ProfilePersonalInfo;
