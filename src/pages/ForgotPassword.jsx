import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../helper/firebaseClient";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setError("");
    setEmail(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setError("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent.");
      setError("");
    } catch (error) {
      setError(error.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center font-raleway h-screen">
      <form
        onSubmit={handleSubmit}
        className="border-2 rounded-md border-indigo-100 p-8"
      >
        <div className="w-full">
          <InputLabel className="text-md text-left mb-2" htmlFor="email">
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

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {message && (
          <p className="text-indigo-500 text-center mt-2">{message}</p>
        )}

        {loading ? (
          <CircularProgress
            className="mt-8"
            style={{ color: "#000", height: 25, width: 25 }}
          />
        ) : (
          <button
            type="submit"
            onClick={handleSubmit}
            className="mt-4 bg-[#C8C6FF] hover:bg-violet-200 border rounded-md border-[#131149] py-2.5 px-8 text-sm font-semibold"
          >
            Send
          </button>
        )}

        <p className="text-gray-500 mt-4">
          Proceed to {" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
