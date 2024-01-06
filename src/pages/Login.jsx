import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
import axios from "axios";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import twokeyLanding from "../assets/twokeyLanding.png";
import ErrorPage from "../components/ErrorPage";
import { useMediaQuery } from "@mui/material";
import { useAuth } from "../context/authContext";
import HidePassword from "../assets/hidePassword.svg";
import ShowPassword from "../assets/showPassword.svg";

const Login = () => {
  let navigate = useNavigate();
  const { getProfileData } = useAuth();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    organization: "",
  });
  const [organizationData, setOrganizationData] = useState("");
  const [pageErr, setPageErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  console.log(formData);

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

    if (
      formData.email.trim() === "" ||
      formData.password.trim() === "" ||
      formData.organization.trim() === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // setToken(data);
      if (data) {
        sessionStorage.setItem("token", JSON.stringify(data));
        getProfileData();
      }

      // change the active status
      let body = {
        id: data.user.id,
        is_active: true,
      };
      console.log("onboarding body:", body);
      try {
        const res = await axios.put(
          "https://twokeybackend.onrender.com/users/updateProfile/",
          body,
          {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    const orgData = async () => {
      try {
        const org = await axios.get(
          "https://twokeybackend.onrender.com/org/list_orgs"
        );
        console.log(org.data);
        setOrganizationData(org.data);
        setPageErr(null);
      } catch (error) {
        const errMsg = error.message + "\n" + "Please try again later.";
        alert(errMsg);
        console.log(error.message);
        setPageErr(errMsg);
      }
    };

    orgData();
  }, []);

  /**
   * if the user is already logged in then redirect to the dashboard,
   * instead of returning the login page
   */
  if (sessionStorage.getItem("token")) {
    navigate("/dashboard");
  }

  /**
   * comment this out on dev mode
   * as the api call fails from localhost
   */
  // if (pageErr) {
  //   return <ErrorPage error={pageErr} />;
  // }

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
            <InputLabel
              className="text-md text-left mb-2 mt-4"
              id="demo-select-small-label"
            >
              Organization
            </InputLabel>
            <Select
              className="w-full bg-gray-100"
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={formData.organization}
              label="organizations"
              name="organization"
              onChange={handleChange}
              size="small"
            >
              <MenuItem value="None">
                <em>None</em>
              </MenuItem>

              {organizationData.length &&
                organizationData.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
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

          <button
            type="submit"
            className="bg-blue-600 text-white py-1 px-10 text-center mt-16 rounded-sm"
          >
            Sign In
          </button>
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
