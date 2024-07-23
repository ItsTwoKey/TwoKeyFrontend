import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../helper/firebaseClient";
import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function logout() {
      secureLocalStorage.clear();
      await auth.signOut();
    }
    logout();
  }, []);

  const handleChange = (event) => {
    setError("");
    setEmail(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (email.trim() === "") {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent.");
      setError("");
    } catch (error) {
      setError(error.message || "Something went wrong");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center font-raleway h-screen bg-[#F1F1FF]">
      <form
        onSubmit={handleSubmit}
        className="border-2 rounded-md border-indigo-100 p-12 bg-white w-full md:w-1/3"
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

        <button
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="mt-4 bg-[#C8C6FF] hover:bg-violet-200 border rounded-md border-[#131149] py-2.5 px-8 text-sm font-semibold flex items-center gap-4 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
          {loading && (
            <CircularProgress
              style={{ color: "#000", height: 25, width: 25 }}
            />
          )}
        </button>

        {error && <p className="text-red-500 text-left mt-2">{error}</p>}
        {message && <p className="text-green-600 text-left mt-2">{message}</p>}

        <p className="text-gray-500 mt-4">
          Or proceed to{"  "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
