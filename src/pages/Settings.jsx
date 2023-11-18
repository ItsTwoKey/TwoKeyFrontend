import React, { useState } from "react";
import ShowPassword from "../assets/showPassword.svg";
import HidePassword from "../assets/hidePassword.svg";
import { supabase } from "../helper/supabaseClient";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Pen from "../assets/pen.svg";

const Settings = () => {
  const [passwordChangeData, setPasswordChangeData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const toggleEditing = async () => {
    if (isEditing) {
      // Check if there are any changes in the password data
      if (
        passwordChangeData.oldPassword === "" &&
        passwordChangeData.newPassword === "" &&
        passwordChangeData.confirmPassword === ""
      ) {
        // No changes in the password data, exit the function
        setIsEditing(!isEditing);
        return;
      }

      // Check if the old password is correct
      let token = JSON.parse(sessionStorage.getItem("token"));
      try {
        await supabase.auth.signInWithPassword({
          email: token.user.email,
          password: passwordChangeData.oldPassword,
        });
      } catch (error) {
        // Handle incorrect old password
        console.error("Old password is incorrect");
        return;
      }

      if (
        passwordChangeData.newPassword !== passwordChangeData.confirmPassword
      ) {
        setPasswordMatchError(true);
        setSnackbarSeverity("error");
        setSnackbarMessage("Passwords do not match");
        setSnackbarOpen(true);
        return;
      } else {
        setPasswordMatchError(false);
        console.log("PasswordData:", passwordChangeData);
        let changePassword = await supabase.auth.updateUser({
          password: passwordChangeData.confirmPassword,
        });
        console.log("changePassword:", changePassword);

        // Display success message
        setSnackbarSeverity("success");
        setSnackbarMessage("Password changed successfully!");
        setSnackbarOpen(true);
      }

      // Clear input fields
      setPasswordChangeData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordChangeData({
      ...passwordChangeData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field],
    });
  };

  return (
    <div className="p-4">
      <div className="p-2 my-4 border border-[#868FA066] w-full rounded-xl">
        <h2 className="text-lg font-semibold p-2">Password Change</h2>
        <div className="flex flex-row justify-between items-center p-2">
          <div className="flex flex-col gap-2">
            <span>
              <h5 className="px-2 font-semibold">Old Password</h5>
              <div className="relative">
                <input
                  type={
                    passwordVisibility.showOldPassword ? "text" : "password"
                  }
                  name="oldPassword"
                  value={passwordChangeData.oldPassword}
                  onChange={handleInputChange}
                  className={`text-md placeholder-gray-500 p-2 my-1 rounded-md ${
                    isEditing ? "bg-white shadow-xl border" : "bg-inherit"
                  }`}
                  placeholder="Old Password"
                  disabled={!isEditing}
                  required
                />
                {isEditing && (
                  <button
                    onClick={() => togglePasswordVisibility("showOldPassword")}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2"
                  >
                    {passwordVisibility.showOldPassword ? (
                      <img src={HidePassword} alt="Hide" />
                    ) : (
                      <img src={ShowPassword} alt="Show" />
                    )}
                  </button>
                )}
              </div>
            </span>
            <span>
              <h5 className="px-2 font-semibold">New Password</h5>
              <div className="relative">
                <input
                  type={
                    passwordVisibility.showNewPassword ? "text" : "password"
                  }
                  name="newPassword"
                  value={passwordChangeData.newPassword}
                  onChange={handleInputChange}
                  className={`text-md placeholder-gray-500 p-2 my-1 rounded-md ${
                    isEditing ? "bg-white shadow-xl border" : "bg-inherit"
                  }`}
                  placeholder="New Password"
                  disabled={!isEditing}
                  required
                />
                {isEditing && (
                  <button
                    onClick={() => togglePasswordVisibility("showNewPassword")}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2"
                  >
                    {passwordVisibility.showNewPassword ? (
                      <img src={HidePassword} alt="Hide" />
                    ) : (
                      <img src={ShowPassword} alt="Show" />
                    )}
                  </button>
                )}
              </div>
            </span>
            <span>
              <h5 className="px-2 font-semibold">Confirm Password</h5>
              <div className="relative">
                <input
                  type={
                    passwordVisibility.showConfirmPassword ? "text" : "password"
                  }
                  name="confirmPassword"
                  value={passwordChangeData.confirmPassword}
                  onChange={handleInputChange}
                  className={`text-md placeholder-gray-500 p-2 my-1 rounded-md ${
                    isEditing ? "bg-white shadow-xl border" : "bg-inherit"
                  } ${passwordMatchError ? "border-red-500" : ""}`}
                  placeholder="Confirm Password"
                  disabled={!isEditing}
                  required
                />
                {isEditing && (
                  <button
                    onClick={() =>
                      togglePasswordVisibility("showConfirmPassword")
                    }
                    className="absolute top-1/2 right-3 transform -translate-y-1/2"
                  >
                    {passwordVisibility.showConfirmPassword ? (
                      <img src={HidePassword} alt="Hide" />
                    ) : (
                      <img src={ShowPassword} alt="Show" />
                    )}
                  </button>
                )}
              </div>
              {passwordMatchError && (
                <p className="text-red-500 text-sm">Passwords do not match</p>
              )}
            </span>
          </div>
          <button
            onClick={toggleEditing}
            className={`w-16 px-2 py-1 text-sm border shadow-lg rounded-md flex flex-row gap-2 justify-center items-center ${
              isEditing ? "bg-blue-700 text-white" : "bg-white"
            }`}
          >
            {!isEditing && <img src={Pen} alt="." />}
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Settings;
