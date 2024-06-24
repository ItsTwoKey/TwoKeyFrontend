import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { useDepartment } from "../context/departmentContext";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { api } from "../utils/axios-instance";
import { auth } from "../helper/firebaseClient";

const ProfilePersonalInfo = ({ isEditing }) => {
  const { departments: newDepartments } = useDepartment();
  const { profileData, setProfileData } = useAuth();
  const [formData, setFormData] = useState({
    firstName: profileData?.name || "",
    lastName: profileData?.last_name || "",
    email: profileData?.email || "",
    phone: profileData?.phone || 0,
    designation: profileData?.role_priv || "",
    department: newDepartments[0]?.name || profileData?.dept || "",
  });

  const [prevIsEditing, setPrevIsEditing] = useState(isEditing);
  const [departments, setDepartments] = useState([]);
  const [userDept, setUserDept] = useState();

  useEffect(() => {
    setFormData({
      firstName: profileData?.name || "",
      lastName: profileData?.last_name || "",
      email: profileData?.email || "",
      phone: profileData?.phone || 0,
      designation: profileData?.role_priv || "",
      department: userDept || "",
    });
  }, [departments, userDept]);

  useEffect(() => {
    if (prevIsEditing && !isEditing) {
      const updateProfile = async () => {
        let token = await auth.currentUser.getIdToken();
        // TODO: Refactor to update dept with its id and not name
        // Check if the department has changed
        const isDepartmentChanged =
          formData.department.id !== profileData?.dept;

        // Only include the department in the update if it has changed
        const updateData = {
          id: profileData.id,
          name: formData.firstName,
          last_name: formData.lastName,
          // email: formData.email,
          phone: formData.phone,
          role_priv: formData.designation,
          ...(isDepartmentChanged && { dept: formData.department }), // Include department only if it has changed
        };

        try {
          const res = await api.put(`/users/update-profile/`, {
            profileData: updateData,
            idToken: token,
          });

          toast.success("Profile updated successfully");
          setProfileData(res.data);
          secureLocalStorage.setItem("profileData", JSON.stringify(res.data));
        } catch (error) {
          toast.error("Error updating profile");
        }
      };

      updateProfile();
    }

    setPrevIsEditing(isEditing);
  }, [isEditing, formData, prevIsEditing]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const dep = await api.get(`/dept/listDepts`);
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

  useEffect(() => {
    function filterDeptById(depts, targetDeptId) {
      // Filter the departments based on the target department ID
      return depts.filter((dept) => dept.id === targetDeptId);
    }
    const filteredUserDept = filterDeptById(departments, profileData?.dept);
    setUserDept(filteredUserDept);
  }, [departments, profileData?.dept]);

  return (
    <div className="p-4 my-4 bg-[#F7F8FA] border shadow-lg border-gray-200 w-full rounded-xl">
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:gird-cols-4 gap-4">
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
            className={`text-md  placeholder-gray-500 p-2 rounded-md bg-inherit ${
              isEditing && "cursor-not-allowed"
            }`}
            placeholder="Email Address"
            disabled={true}
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
            placeholder="Phone Number"
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
            disabled={!isEditing || profileData?.role_priv === "employee"}
          />
        </span>
        <span>
          <h5 className="px-2 font-semibold">Department</h5>
          {isEditing ? (
            <select
              name="department"
              value={formData.department.id}
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
              placeholder={(userDept && userDept[0]?.name) || "Department"}
              disabled={!isEditing}
            />
          )}
        </span>
      </div>
    </div>
  );
};

export default ProfilePersonalInfo;
