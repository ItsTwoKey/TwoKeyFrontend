import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { auth } from "../helper/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  // const [userMetaData, setUserMetaData] = useState([]);
  let navigate = useNavigate();
  const { fetchProfileData } = useAuth();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  function handleChange(event) {
    setError(null);
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  const detectDeviceType = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check for mobile devices
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }
    if (/android/i.test(userAgent)) {
      return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
    }

    // If none of the above, assume desktop
    return "Desktop";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email.trim() === "" || formData.password.trim() === "") {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const { user } = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const token = await user.getIdToken();

      const deviceType = detectDeviceType();

      const userInfo = {
        email: formData.email,
        is_active: true,
        metadata: {
          devices: navigator?.userAgentData?.platform || "unknown",
          deviceType,
        },
      };

      try {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/login/`,
          userInfo
        );

        const userMetaData = res.data.user;
        setMessage(res.data.message);
        secureLocalStorage.setItem("token", token);

        // TODO: add fetchprofiledata and listdepartments logic

        await fetchProfileData();
        await listDepartments();

        console.log("userMetaData", userMetaData);

        if (
          userMetaData.username &&
          userMetaData.name &&
          userMetaData.last_name &&
          userMetaData.dept &&
          userMetaData.profilePictureUrl
        ) {
          navigate("/dashboard");
        } else {
          navigate("/onboard");
        }
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.error || "Something went wrong");
      }
    } catch (error) {
      handleFirebaseError(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseError = (error) => {
    let errorMessage = "An error occurred. Please try again.";

    if (error.code == "auth/invalid-email") {
      errorMessage = "Invalid email format.";
    }
    if (error.code == "auth/user-disabled") {
      errorMessage = "This account has been disabled.";
    }
    if (error.code == "auth/user-not-found") {
      errorMessage = "No user found with this email.";
    }
    if (error.code == "auth/invalid-credential") {
      errorMessage = "Invalid Credentials";
    }
    if (error.code == "auth/too-many-requests") {
      errorMessage =
        "Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.";
    }

    setError(errorMessage);
  };

  const listDepartments = async () => {
    try {
      let token = secureLocalStorage.getItem("token");
      const departments = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/dept/listDepts`,
        { headers: { Authorization: token } }
      );

      if (departments.data) {
        console.log("at login", departments.data);
        secureLocalStorage.setItem(
          "departments",
          JSON.stringify(departments.data)
        );
        // navigate("/dashboard");
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
    <div className="flex flex-col md:flex-row font-raleway">
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
              style={{ color: "#000", height: 25, width: 25 }}
            />
          ) : (
            <button
              type="submit"
              // className="bg-blue-600 text-white py-1 px-10 text-center mt-16 rounded-sm hover:bg-blue-500"
              className="bg-[#C8C6FF] hover:bg-violet-200 border rounded-md border-[#131149] py-2.5 px-8 text-sm font-semibold"
            >
              Sign In
            </button>
          )}

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {message && (
            <p className="text-indigo-500 text-center mt-2">{message}</p>
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
