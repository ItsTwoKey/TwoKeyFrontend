import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
    agreeToPrivacyPolicy: false,
  });

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleButtonClick = () => {
    console.log("Form Data:", formData);
    // You can perform additional actions with the form data here
  };

  return (
    <div className="bg-[#FAF8F7] h-full py-6">
      <div className="flex flex-col justify-center items-center">
        <p className="text-sm font-semibold">Contact us</p>
        <h3 className="text-3xl font-semibold my-2">Get in touch</h3>
        <p className="text-md text-[#667085] mt-2 w-11/12 md:w-auto">
          We’d love to hear from you. Please fill out this form.
        </p>

        <div className="w-11/12 md:w-1/3 my-8 ">
          <div className="flex gap-6 flex-row items-center">
            <div className="">
              <InputLabel
                className=" text-left mb-2 mt-4"
                style={{ fontSize: "14px", fontWeight: "bold" }}
                id="firstName"
              >
                First Name
              </InputLabel>
              <span id="firstName" className="flex flex-row gap-2">
                <TextField
                  id="outlined-basic-firstName"
                  variant="outlined"
                  className="w-full bg-white rounded-[8px]"
                  placeholder="First Name"
                  name="firstName"
                  onChange={handleChange}
                  size="small"
                />
              </span>
            </div>
            <div className="">
              <InputLabel
                className="text-md text-left mb-2 mt-4"
                style={{ fontSize: "14px", fontWeight: "bold" }}
                id="lastName"
              >
                Last Name
              </InputLabel>
              <span id="lastName" className="flex flex-row gap-2">
                <TextField
                  id="outlined-basic-lastName"
                  variant="outlined"
                  className="w-full bg-white rounded-[8px]"
                  placeholder="Last Name"
                  name="lastName"
                  onChange={handleChange}
                  size="small"
                />
              </span>
            </div>
          </div>

          <div className="">
            <InputLabel
              className="text-sm text-left mb-2 mt-4"
              style={{ fontSize: "14px", fontWeight: "bold" }}
              id="email"
            >
              Email
            </InputLabel>
            <span id="email" className="flex flex-row gap-2">
              <TextField
                id="outlined-basic-email"
                variant="outlined"
                className="w-full bg-white rounded-[8px]"
                placeholder="you@company.com"
                name="email"
                onChange={handleChange}
                size="small"
              />
            </span>
          </div>

          <div className="">
            <InputLabel
              className="text-md text-left mb-2 mt-4"
              style={{ fontSize: "14px", fontWeight: "bold" }}
              id="phoneNumber"
            >
              Phone number
            </InputLabel>
            <span id="phoneNumber" className="flex flex-row gap-2">
              <TextField
                id="outlined-basic-phoneNumber"
                variant="outlined"
                className="w-full bg-white rounded-[8px]"
                placeholder="123-456-7890"
                name="phoneNumber"
                onChange={handleChange}
                size="small"
              />
            </span>
          </div>

          <div className="">
            <InputLabel
              className="text-md text-left mb-2 mt-4"
              style={{ fontSize: "14px", fontWeight: "bold" }}
              id="message"
            >
              Message
            </InputLabel>
            <span id="message" className="flex flex-row gap-2">
              <TextField
                id="outlined-basic-message"
                variant="outlined"
                className="w-full bg-white rounded-[8px]"
                multiline
                rows={4}
                placeholder=" "
                name="message"
                onChange={handleChange}
                size="small"
              />
            </span>
          </div>

          <div className="flex items-center my-3">
            <input
              type="checkbox"
              id="agreeToPrivacyPolicy"
              name="agreeToPrivacyPolicy"
              checked={formData.agreeToPrivacyPolicy}
              onChange={handleChange}
            />
            <label htmlFor="agreeToPrivacyPolicy" className="ml-2">
              You agree to our friendly{" "}
              <a href="#" alt="privacy policy" className="underline">
                privacy policy
              </a>
              .
            </label>
          </div>

          <button
            className="w-full bg-[#C8C6FF] shadow border border-[#7F56D9] rounded-[8px] my-4 py-2 text-sm font-semibold"
            onClick={handleButtonClick}
          >
            Send message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
