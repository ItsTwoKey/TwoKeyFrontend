import React, { useState } from "react";
import { supabase } from "../helper/supabaseClient";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import RadioGroup from "@mui/joy/RadioGroup";
import Radio from "@mui/joy/Radio";
import Inviteicon from "../assets/InviteMember.svg";

const InviteMember = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    role: "employee",
  });

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

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

  const handleInvite = async () => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));

      let body = {
        emails: [formData.emailAddress],
      };

      let response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/invite/`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log("invite member:", response);
      closeDialog();
    } catch (error) {
      console.log("error occurew while adding dept", error);
    }
  };

  return (
    <div className="">
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
                <FormControl size="sm">
                  <Radio
                    overlay
                    value="manager"
                    label="Manager"
                    sx={{ fontWeight: "bold", marginBottom: "3px" }}
                  />
                  <FormHelperText className="">
                    Manager can do everything, including managin users and
                    deleting current administrators.
                  </FormHelperText>
                </FormControl>
                <FormControl size="sm">
                  <Radio
                    overlay
                    value="departmentHead"
                    label="Department Head"
                    sx={{ fontWeight: "bold", marginBottom: "3px" }}
                  />
                  <FormHelperText>
                    Department Head manages the attendance of the employee. It
                    also records their skill set so that employees can be
                    assigned to particular task when needed. They also manage
                    payroll module so that the payroll is generated on time
                    without fail.
                  </FormHelperText>
                </FormControl>
                <FormControl size="sm">
                  <Radio
                    overlay
                    value="employee"
                    label="Employee"
                    sx={{ fontWeight: "bold", marginBottom: "3px" }}
                  />
                  <FormHelperText>
                    Employee can login in portal for attendence, leave, Task
                    management from this portal they can track their attendence
                    and leave balance also.
                  </FormHelperText>
                </FormControl>
              </RadioGroup>
            </div>
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
