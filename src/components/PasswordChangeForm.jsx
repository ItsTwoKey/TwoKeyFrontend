import React, { useEffect, useState } from "react";
// import ShowPassword from "../assets/showPassword.svg";
// import HidePassword from "../assets/hidePassword.svg";
import {
  getAuth,
  EmailAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
} from "firebase/auth";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import secureLocalStorage from "react-secure-storage";
import CircularProgress from "@mui/material/CircularProgress";

const PasswordChangeForm = () => {
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

  const [email, setEmail] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [samePasswordWarning, setSamePasswordWarning] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let data = JSON.parse(secureLocalStorage.getItem("profileData"));
    setEmail(data.email);
  }, []);

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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChangePassword = async () => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setSnackbarSeverity("error");
      setSnackbarMessage("User not authenticated");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      // Reauthenticate the user
      const credential = EmailAuthProvider.credential(
        email,
        passwordChangeData.oldPassword
      );
      await reauthenticateWithCredential(user, credential);

      if (passwordChangeData.newPassword === passwordChangeData.oldPassword) {
        setSamePasswordWarning(true);
        setSnackbarSeverity("warning");
        setSnackbarMessage("Current Password and New passwords are the same");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      if (
        passwordChangeData.newPassword !== passwordChangeData.confirmPassword
      ) {
        setPasswordMatchError(true);
        setSnackbarSeverity("error");
        setSnackbarMessage("Passwords do not match");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      } else {
        setSamePasswordWarning(false);
        setPasswordMatchError(false);
        console.log("PasswordData:", passwordChangeData);

        await updatePassword(user, passwordChangeData.newPassword);

        // Display success message
        setSnackbarSeverity("success");
        setSnackbarMessage("Password changed successfully!");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("An error occurred while changing the password");
      setLoading(false);
    }

    setSnackbarOpen(true);

    // Clear input fields
    setPasswordChangeData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Check if all fields are filled
  const areFieldsFilled =
    passwordChangeData.oldPassword &&
    passwordChangeData.newPassword &&
    passwordChangeData.confirmPassword;

  return (
    <div className="p-4 rounded-xl">
      <h2 className="text-xl font-semibold p-2">Account Settings</h2>
      <hr className="border border-white border-b-[#D8DEE4]" />

      <div className="flex flex-col gap-3 px-2 py-4">
        <h5 className="font-semibold">Email address</h5>
        <p className="text-sm text-gray-600">
          Your email address is{" "}
          <strong className="text-gray-900">{email}</strong>
        </p>
      </div>

      <div className="px-2 py-4">
        <h5 className="font-semibold my-2">Password</h5>

        <div className="">
          <h5 className="font-semibold text-gray-600">Current Password</h5>

          <input
            type={passwordVisibility.showOldPassword ? "text" : "password"}
            name="oldPassword"
            value={passwordChangeData.oldPassword}
            onChange={handleInputChange}
            className={`w-64 text-md placeholder-gray-500 p-2 my-1 rounded-md bg-white border`}
            placeholder="Old Password"
            required
          />
        </div>

        <div className="flex flex-row gap-6">
          <div>
            <h5 className="font-semibold text-gray-600">New Password</h5>
            <input
              type={passwordVisibility.showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwordChangeData.newPassword}
              onChange={handleInputChange}
              className={`w-64 text-md placeholder-gray-500 p-2 my-1 rounded-md bg-white border`}
              placeholder="New Password"
              required
            />
          </div>

          <div>
            <h5 className="font-semibold text-gray-600">Confirm Password</h5>
            <input
              type={
                passwordVisibility.showConfirmPassword ? "text" : "password"
              }
              name="confirmPassword"
              value={passwordChangeData.confirmPassword}
              onChange={handleInputChange}
              className={`w-64 text-md placeholder-gray-500 p-2 my-1 rounded-md bg-white border ${
                passwordMatchError ? "border-red-500" : ""
              }`}
              placeholder="Confirm Password"
              required
            />
          </div>
        </div>
        <p className="text-xs text-gray-700">
          New password should be different from the current one.
        </p>
      </div>

      <button
        onClick={handleChangePassword}
        className={`flex mx-2 px-4 py-1.5 text-center text-sm border shadow-lg rounded-md text-white ${
          (areFieldsFilled && !loading) ? "bg-[#5E5ADB]" : "bg-[#5e5adb98] cursor-not-allowed"
        }`}
        disabled={!areFieldsFilled || loading}
      >
        Save Password
        {loading && (
          <CircularProgress
            size={20}
            style={{ color: "white", marginLeft: "10px" }}
          />
        )}
      </button>

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

export default PasswordChangeForm;
