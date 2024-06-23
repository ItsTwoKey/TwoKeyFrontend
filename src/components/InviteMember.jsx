import React, { useState, useEffect } from "react";
import secureLocalStorage from "react-secure-storage";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/joy/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import RadioGroup from "@mui/joy/RadioGroup";
import Radio from "@mui/joy/Radio";
import Inviteicon from "../assets/InviteMember.svg";
import toast, { Toaster } from "react-hot-toast";
import { useDepartment } from "../context/departmentContext";
import { api } from "../utils/axios-instance";

const InviteMember = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    role: "",
    department: "", // Add department in formData state
  });
  const [roles, setRoles] = useState([]);
  const { departments } = useDepartment();

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const getRoles = async () => {
      try {
        const role = await api.get(`/role/listRoles`);
        console.log("roles:", role.data);
        setRoles(role.data);
      } catch (error) {
        console.log("Error fetching departments");
      }
    };

    getRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  // Define handleDepartmentChange function to update department in formData state
  const handleDepartmentChange = (e) => {
    setFormData({
      ...formData,
      department: e.target.value,
    });
  };

  const handleInvite = async () => {
    try {
      let body = {
        emails: [formData.emailAddress],
        first_name: formData.firstName,
        last_name: formData.lastName,
        role_id: formData.role,
        dept_id: formData.department,
      };

      let response = await api.post(`/users/invite`, body);
      // console.log("invite member:", response);
      if (response) {
        toast.success("User invited successfully.");
        closeDialog();
      }
    } catch (error) {
      console.log("error occurew while inviting user", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="">
      <Toaster position="bottom-left" reverseOrder={false} />
      <div
        onClick={openDialog}
        className="py-4 px-4 rounded-md border bg-[#f7f7ff] flex flex-col items-center hover:bg-indigo-100"
      >
        <img
          src={Inviteicon}
          alt="invite memeber"
          className="h-10 aspect-auto"
        />
        Invite Member
      </div>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "5px",
          },
        }}
      >
        <DialogTitle>Invite Member</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2">
            <div className="flex flex-row justify-between items-center gap-4">
              <span className="">
                <p className="my-1">
                  First Name<span className="text-[#5E5ADB]"> *</span>
                </p>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="border rounded-md w-56 px-2 py-1 shadow"
                />
              </span>
              <span>
                <p className="my-1">
                  Last Name<span className="text-[#5E5ADB]"> *</span>
                </p>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="border rounded-md w-56 px-2 py-1 shadow"
                />
              </span>
            </div>
            <span className="">
              <p className="my-1">
                Email Address<span className="text-[#5E5ADB]"> *</span>
              </p>
              <input
                type="text"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                required
                className="border rounded-md w-full px-2 py-1 shadow"
              />
            </span>
            <div className="w-[446px] my-4">
              <RadioGroup
                name="role"
                sx={{ gap: 1, "& > div": { p: 1 } }}
                value={formData.role || ""} // Ensure value is always defined
                onChange={handleRadioChange}
              >
                {roles.length ? (
                  roles.map((role) => (
                    <FormControl size="sm" key={role.id}>
                      <Radio
                        overlay
                        value={role.id}
                        label={role.role}
                        sx={{ fontWeight: "bold", marginBottom: "3px" }}
                      />
                    </FormControl>
                  ))
                ) : (
                  <p>Loading the roles...</p>
                )}
              </RadioGroup>
            </div>

            {/* Add Select component for department */}
            <Select
              value={formData.department}
              label="Department"
              onChange={handleDepartmentChange}
              className="w-36 h-8"
              sx={{ borderRadius: "6px" }}
              size="small"
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-2 py-1 mx-2 rounded-lg shadow-sm border border-gray-300 hover:text-red-400"
            onClick={closeDialog}
            color="primary"
          >
            Cancel
          </button>
          <button
            className="px-2 py-1 rounded-lg shadow-sm bg-[#5E5ADB] hover:bg-indigo-400 text-white"
            onClick={handleInvite}
          >
            Invite
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InviteMember;
