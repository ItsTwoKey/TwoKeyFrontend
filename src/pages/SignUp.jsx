import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TextField, useMediaQuery } from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import twokeySignup from "../assets/twokeySignup.png";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../helper/firebaseClient";

const SignUp = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    organization: "",
  });

  const [organizationData, setOrganizationData] = useState([]);
  const [pageErr, setPageErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

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
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/sign-up/`,
        {
          ...formData,
          uid: user.uid,
          // organization: "test",
        }
      );

      const { message } = response.data;

      setMessage(message);
      setLoading(false);
    } catch (err) {
      setError(
        err.errors ? err.errors[0].message : err.error || "An error occurred"
      );
      setLoading(false);
    }
  }

  useEffect(() => {
    const orgData = async () => {
      try {
        const org = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/org/list_orgs`
        );
        console.log(org.data);
        setOrganizationData(org.data);
      } catch (error) {
        const errMsg = error.message + "Please try again later.";
        console.log(error.message);
        setPageErr(errMsg);
      }
    };

    orgData();
  }, []);
  /**
   * comment this out on dev mode
   * as the api call fails from localhost
   */
  // if (pageErr) {
  //   return <ErrorPage error={pageErr} />;
  // }

  return (
    <div className="flex flex-col md:flex-row font-raleway">
      {!isSmallScreen && (
        <div className="w-full md:w-1/2">
          <img
            className="h-screen w-screen"
            src={twokeySignup}
            alt="twokeySignupImage"
          />
        </div>
      )}

      <div className="bg-white flex flex-col justify-center items-center w-full md:w-1/2">
        <h1 className="text-5xl text-center mt-8 font-semibold ">
          Welcome to Twokey
        </h1>

        <form
          onSubmit={handleSubmit}
          className="p-4 text-center w-full md:w-11/12"
        >
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
              {organizationData.length &&
                organizationData.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>

            <InputLabel className="text-md text-left mb-2 mt-4" id="fullname">
              Full Name
            </InputLabel>

            <TextField
              id="fullname"
              variant="outlined"
              className="w-full bg-gray-100"
              placeholder="John Doe"
              name="fullName"
              onChange={handleChange}
              size="small"
            />

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

            <InputLabel className="text-md text-left mb-2 mt-4" id="Password">
              Password
            </InputLabel>

            <TextField
              id="password"
              variant="outlined"
              placeholder="Enter your Password"
              className="w-full bg-gray-100"
              name="password"
              type="password"
              onChange={handleChange}
              size="small"
            />
          </span>

          {loading ? (
            <CircularProgress
              style={{ color: "#000", height: 25, width: 25 }}
            />
          ) : (
            <button
              type="submit"
              // className="bg-blue-600 text-white py-1 px-10 text-center mt-8 rounded-sm"
              className="bg-[#C8C6FF] hover:bg-violet-200 border rounded-md border-[#131149] py-2.5 px-8 text-sm font-semibold"
            >
              Sign Up
            </button>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-indigo-500 text-center">{message}</p>}

          <p className="text-gray-500 mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
