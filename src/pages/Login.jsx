import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
import axios from "axios";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import twokeyLanding from "../assets/twokeyLanding.png";
import { useMediaQuery } from "@mui/material";
import { useAuth } from "../context/authContext";
import HidePassword from "../assets/hidePassword.svg";
import ShowPassword from "../assets/showPassword.svg";
import CircularProgress from "@mui/material/CircularProgress";
import secureLocalStorage from "react-secure-storage";

const Login = () => {
  let navigate = useNavigate();
  const { fetchProfileData } = useAuth();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.email.trim() === "" || formData.password.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data) {
        secureLocalStorage.setItem("token", JSON.stringify(data));
        fetchProfileData();
      }

      let body = {
        id: data.user.id,
        is_active: true,
        metadata: { devices: navigator?.userAgentData?.platform || "unknown" },
      };

      try {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/users/updateProfile`,
          body,
          {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
          }
        );

        console.log("meta", res);
      } catch (error) {
        console.log(error);
      }

      listDepartments();
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const listDepartments = async () => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));
      const departments = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/dept/listDepts`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      if (departments.data) {
        console.log("at login", departments.data);
        secureLocalStorage.setItem(
          "departments",
          JSON.stringify(departments.data)
        );
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (secureLocalStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col md:flex-row">
      {!isSmallScreen && (
        <div className="w-full md:w-1/2 ">
          <img
            className="h-screen w-full object-cover"
            src={twokeyLanding}
            alt="twokeyLandingImage"
          />
        </div>
      )}

      <div className="bg-white flex flex-col justify-center items-center w-full md:w-1/2 p-4">
        <h1 className="text-5xl text-center mt-4 font-semibold ">
          Welcome to Twokey
        </h1>

        <form onSubmit={handleSubmit} className="text-center w-full md:w-11/12">
          <span className="my-4 flex flex-col justify-center ">
            <div className="w-full">
              <InputLabel className="text-md text-left mb-2 mt-4" id="email">
                Email
              </InputLabel>
              <span id="email" className="flex flex-row gap-2">
                <TextField
                  id="outlined-basic-email"
                  variant="outlined"
                  className="w-full bg-gray-100"
                  placeholder="Enter your Email here"
                  name="email"
                  onChange={handleChange}
                  size="small"
                  autoFocus
                />
              </span>
            </div>

            <InputLabel className="text-md text-left mb-2 mt-4" id="password">
              Password
            </InputLabel>

            <div className="relative w-full">
              <TextField
                id="password"
                variant="outlined"
                placeholder="Enter your Password"
                className="w-full bg-gray-100 pr-10"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                size="small"
              />

              <IconButton
                onClick={toggleShowPassword}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {showPassword ? (
                  <img src={ShowPassword} alt="Show" />
                ) : (
                  <img src={HidePassword} alt="Hide" />
                )}
              </IconButton>
            </div>
          </span>

          <div className="flex justify-end">
            <a
              href="/forgot-password"
              alt="forgot password"
              className="text-blue-900 text-sm "
            >
              Forgot password?
            </a>
          </div>

          {loading ? (
            <CircularProgress
              className="mt-12"
              style={{ color: "#000", height: 25, width: 25 }}
            />
          ) : (
            <button
              type="submit"
              className="bg-blue-600 text-white py-1 px-10 text-center mt-16 rounded-sm hover:bg-blue-500"
            >
              Sign In
            </button>
          )}

          <p className="text-gray-500 mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
