import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { supabase } from "../helper/supabaseClient";
import secureLocalStorage from "react-secure-storage";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  width: "60vw",
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "white",
  border: `1px solid #fff`,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const Onboarding = () => {
  const [expanded, setExpanded] = useState("panel1");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    department: "",
    firstName: "",
    lastName: "",
    profileUrl: "",
    profilePicture: null,
  });

  const [isPictureSelected, setIsPictureSelected] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [isFormComplete, setIsFormComplete] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const depData = async () => {
      try {
        let token = JSON.parse(secureLocalStorage.getItem("token"));
        const dep = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/dept/listDepts`,
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log("Departments:", dep.data);
        setDepartmentList(dep.data);
      } catch (error) {
        console.log("Error fetching departments");
      }
    };

    depData();
  }, []);

  /**
   * if user is already logged in then redirect to dashboard,
   * instead of returning the login page
   */
  if (secureLocalStorage.getItem("token")) {
    navigate("/dashboard");
  }

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFormData({
        ...formData,
        profilePicture: file,
      });
      setIsPictureSelected(true);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
    maxFiles: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData", formData);
  };

  useEffect(() => {
    checkFormCompletion();
  }, [formData]);

  const checkFormCompletion = () => {
    const { email, password, username, firstName, lastName, profilePicture } =
      formData;

    // Check if all required fields are filled
    if (
      email.trim() !== "" &&
      password.trim() !== "" &&
      username.trim() !== "" &&
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      profilePicture !== null
    ) {
      setIsFormComplete(true);
    } else {
      setIsFormComplete(false);
    }
  };

  // const handleNextButtonClick = async () => {
  //   console.log(formData);

  //   try {
  //     const { data, error } = await supabase.auth.signInWithPassword({
  //       email: formData.email,
  //       password: formData.password,
  //     });
  //     sessionStorage.setItem("token", JSON.stringify(data));

  //     if (error) throw error;

  //     // if (data) {
  //     // Update user_info with firm data

  //     handleProfilePictureUpload(data);

  //     // let token = JSON.parse(sessionStorage.getItem("token"));
  //     if (data) {
  //       let body = {
  //         id: data.user.id,
  //         username: formData.username,
  //         name: formData.firstName,
  //         last_name: formData.lastName,
  //         dept: "7075576d-bbbc-47f7-9b50-a272e93dc66f",
  //         profile_pic: formData.profileUrl,
  //       };
  //       console.log("onboarding body:", body);
  //       try {
  //         const res = await axios.put(
  //           `${process.env.REACT_APP_BACKEND_BASE_URL}/users/updateProfile`,
  //           body,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${data.session.access_token}`,
  //             },
  //           }
  //         );

  //         console.log("onboarding success:", res);
  //       } catch (error) {
  //         console.log("Error at  update profile:", error);
  //       }

  //       // console.log("Profile data:", res.data);
  //       // localStorage.setItem("profileData", JSON.stringify(res.data));
  //     }
  //     // navigate("/dashboard");
  //     // }
  //   } catch (error) {
  //     console.log("Error at onboarding", error);
  //   }
  // };

  // const handleProfilePictureUpload = async (token) => {
  //   try {
  //     const { data, error } = await supabase.storage
  //       .from("avatar")
  //       .upload(formData.email, formData.profilePicture, {
  //         cacheControl: "3600",
  //         upsert: false,
  //       });

  //     console.log("File uploaded successfully:", data);

  //     if (error) {
  //       throw error;
  //     }

  //     const { data: url } = await supabase.storage
  //       .from("avatar")
  //       .getPublicUrl(formData.email);

  //     console.log("Public URL:", url.publicUrl);

  //     // Set the publicUrl as profile_pic in the formData
  //     setFormData({
  //       ...formData,
  //       profileUrl: url.publicUrl,
  //     });
  //   } catch (error) {
  //     console.error(
  //       "An error occurred while uploading the profile picture:",
  //       error
  //     );
  //   }
  // };

  const handleProfilePictureUpload = async (token) => {
    try {
      const { data, error } = await supabase.storage
        .from("avatar")
        .upload(formData.email, formData.profilePicture, {
          cacheControl: "3600",
          upsert: false,
        });

      console.log("File uploaded successfully:", data);

      if (error) {
        throw error;
      }

      const { data: url } = await supabase.storage
        .from("avatar")
        .getPublicUrl(formData.email);

      console.log("Public URL:", url.publicUrl);

      // Return the publicUrl
      return url.publicUrl;
    } catch (error) {
      console.error(
        "An error occurred while uploading the profile picture:",
        error
      );
      // Return null or handle the error as needed
      return null;
    }
  };

  const handleNextButtonClick = async () => {
    console.log(formData);
    secureLocalStorage.clear();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      secureLocalStorage.setItem("token", JSON.stringify(data));

      if (error) throw error;

      if (data) {
        const updatedProfileUrl = handleProfilePictureUpload(data);

        setFormData({
          ...formData,
          profileUrl: updatedProfileUrl,
        });

        let body = {
          id: data.user.id,
          username: formData.username,
          name: formData.firstName,
          last_name: formData.lastName,
          dept: "7075576d-bbbc-47f7-9b50-a272e93dc66f",
          profile_pic: updatedProfileUrl,
        };
        console.log("onboarding body:", body);
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

          console.log("onboarding success:", res);
          secureLocalStorage.setItem("profileData", JSON.stringify(res.data));
        } catch (error) {
          console.log("Error at  update profile:", error);
        }
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error at onboarding", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center">
      <div className="text-center p-16">
        <strong className="text-5xl font-raleway">Welcome to TwoKey</strong>
        <p className="text-lg text-gray-400 my-2">
          A secured file sharing platform for companies
        </p>
        <form className="my-16 shadow-lg rounded-lg" onSubmit={handleSubmit}>
          <div>
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography variant="p" className="text-lg font-semibold">
                  Authentication
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="grid grid-cols-1 md:grid-cols-2 md:gap-4 text-left">
                <div className="mb-4">
                  <label className="block text-gray-600 text-sm font-medium p-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="block w-full border rounded-md py-2 px-3"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 text-sm font-medium p-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    className="block w-full border rounded-md py-2 px-3"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
          <div>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography variant="p" className="text-lg font-semibold">
                  General Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 text-left">
                  <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium p-1">
                      Profile Picture
                    </label>
                    {isPictureSelected ? (
                      <img
                        src={URL.createObjectURL(formData.profilePicture)}
                        alt="Profile Pic"
                        className="mt-2 max-h-40 max-w-full rounded-md"
                      />
                    ) : (
                      <div
                        {...getRootProps()}
                        className="mt-2 h-28 w-32 hover:text-blue-400 flex items-center justify-center border-2 border-dashed hover:border-blue-400 border-gray-400 p-4 rounded-md text-center cursor-pointer"
                      >
                        <input {...getInputProps()} />
                        <p>Drop files to upload</p>
                      </div>
                    )}
                  </div>
                  <div></div>
                  <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium p-1">
                      Username
                    </label>
                    <input
                      type="text"
                      className="block w-full border rounded-md py-2 px-3"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                    />
                  </div>
                  {/* <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium p-1">
                      Department
                    </label>

                    <Select
                      className="w-full bg-gray-100"
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={formData.department}
                      label="Departments"
                      name="Departments"
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      size="small"
                    >
                      <MenuItem value="None">
                        <em>None</em>
                      </MenuItem>

                      {departmentList.length &&
                        departmentList.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </div> */}
                  <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium p-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="block w-full border rounded-md py-2 px-3"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-600 text-sm font-medium p-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="block w-full border rounded-md py-2 px-3"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </form>
      </div>
      <footer className="fixed bottom-0 left-0 w-full py-4 text-right p-16 bg-gray-50 bg-opacity-10 backdrop-blur-sm flex justify-between items-center border">
        <Typography variant="p" className="text-sm text-gray-400">
          TwoKey © 2023
        </Typography>
        <button
          type="submit"
          onClick={() => handleNextButtonClick()}
          className={`rounded-md py-2 px-8 text-white bg-blue-700 ${
            !isFormComplete && "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isFormComplete}
        >
          Login
        </button>
      </footer>
    </div>
  );
};

export default Onboarding;
