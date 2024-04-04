import React, { useState } from "react";
import { supabase } from "../helper/supabaseClient";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const sendPasswordResetRequest = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      alert("Check your email for a Password reset link.");
    } catch (error) {
      console.log(
        "error occurred while sending Password Reset Request.",
        error
      );
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form>
        <div className="w-full">
          <InputLabel className="text-md text-left mb-2 mt-4" htmlFor="email">
            Email
          </InputLabel>
          <span id="email" className="flex flex-row gap-2">
            <TextField
              id="outlined-basic-email"
              variant="outlined"
              className="w-full bg-gray-100"
              placeholder="Enter your Email here"
              name="email"
              value={email}
              onChange={handleChange}
              size="small"
              autoFocus
            />
          </span>
        </div>

        {loading ? (
          <CircularProgress
            className="mt-8"
            style={{ color: "#000", height: 25, width: 25 }}
          />
        ) : (
          <button
            onClick={sendPasswordResetRequest}
            className="bg-blue-600 text-white py-1 px-10 text-center mt-16 rounded-sm hover:bg-blue-500"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
