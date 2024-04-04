import React, { useState } from "react";
import { supabase } from "../helper/supabaseClient";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    try {
      // Your code to change the password goes here
      const { data, error } = await supabase.auth.updateUser({
        password: confirmPassword,
      });
      if (error) throw error;

      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <div className="flex flex-row gap-6">
        <div>
          <h5 className="font-semibold text-gray-600">New Password</h5>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-64 text-md placeholder-gray-500 p-2 my-1 rounded-md bg-white border"
            placeholder="New Password"
            required
          />
        </div>

        <div>
          <h5 className="font-semibold text-gray-600">Confirm Password</h5>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-64 text-md placeholder-gray-500 p-2 my-1 rounded-md bg-white border ${
              passwordMatchError ? "border-red-500" : ""
            }`}
            placeholder="Confirm Password"
            required
          />
        </div>
      </div>

      <button
        onClick={handleChangePassword}
        className="w-48 mx-2 px-4 py-1.5 text-center text-sm border shadow-lg rounded-md text-white bg-[#5E5ADB]"
      >
        Save Password
      </button>
    </div>
  );
};

export default ChangePassword;
