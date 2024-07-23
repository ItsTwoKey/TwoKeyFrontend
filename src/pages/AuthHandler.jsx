import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  applyActionCode,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { auth } from "../helper/firebaseClient";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [oobCode, setOobCode] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract oobCode and mode from query params
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("oobCode");
    const mode = query.get("mode");
    setOobCode(code || "");
    setMode(mode || "");
  }, [location]);

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await verifyPasswordResetCode(auth, oobCode);
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("Password has been reset successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.code === "auth/invalid-action-code") {
        setError(
          "This link has already been used. Please click forgot password again."
        );
      } else {
        setError(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    try {
      await applyActionCode(auth, oobCode);
      setMessage("Email has been verified successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "resetPassword") {
      handlePasswordReset();
    } else if (mode === "verifyEmail") {
      handleEmailVerification();
    } else {
      setError("Invalid action mode");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center font-raleway h-screen bg-[#F1F1FF]">
      <form
        onSubmit={handleSubmit}
        className="border-2 rounded-md border-indigo-100 p-12 bg-white w=full md:w-1/3"
      >
        {mode === "resetPassword" && (
          <>
            <h2 className="text-left text-lg font-semibold mb-4">
              Reset Password
            </h2>
            <div className="w-full mb-4">
              <InputLabel htmlFor="password" className="text-md text-left mb-2">
                New Password
              </InputLabel>
              <TextField
                type="password"
                id="password"
                variant="outlined"
                className="w-full bg-gray-100"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
                required
              />
            </div>
            <div className="w-full mb-4">
              <InputLabel
                htmlFor="confirmPassword"
                className="text-md text-left mb-2"
              >
                Confirm Password
              </InputLabel>
              <TextField
                type="password"
                id="confirmPassword"
                variant="outlined"
                className="w-full bg-gray-100"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="small"
                required
              />
            </div>
          </>
        )}

        {mode === "verifyEmail" && (
          <h2 className="text-left text-lg font-semibold mb-4">Click the button to verify you email</h2>
        )}

        <button
          disabled={loading}
          type="submit"
          className="mt-4 bg-[#C8C6FF] hover:bg-violet-200 border rounded-md border-[#131149] py-2.5 px-8 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 flex items-center"
        >
          {mode === "resetPassword" ? "Reset Password" : "Verify Email"}
          {loading && (
            <CircularProgress
              className="ml-4"
              style={{ color: "#000", height: 16, width: 16 }}
            />
          )}
        </button>
        {error && <p className="text-red-500 text-left mt-2">{error}</p>}
        {message && <p className="text-green-500 text-left mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
