import React, { useState } from "react";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Cross from "../assets/cross.svg";
import Tick from "../assets/tick.svg";
import CurlyArrow from "../assets/curlyArrow.svg";
import { useNavigate } from "react-router-dom";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 20,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(22px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 16,
    height: 16,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#04092152" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const PricingDetails = [
  {
    name: "Freebie",
    description:
      "Ideal for individuals who need quick access to basic features.",
    price: "0",
    featureCount: 2,
  },
  {
    name: "Professional",
    description:
      "Ideal for individuals who need advanced features and tools for client work.",
    price: "25",
    featureCount: 6,
  },
  {
    name: "Enterprise",
    description:
      "Ideal for businesses who need personalized services and security for large teams. ",
    price: "100",
    featureCount: 8,
  },
];

const Features = [
  "20,000+ of PNG & SVG graphics",
  "Access to 100 million stock images",
  "Upload custom icons and fonts",
  "Unlimited Sharing",
  "Upload graphics & video in up to 4k",
  "Unlimited Projects",
  "Instant Access to our design system",
  "Create teams to collaborate on designs",
];

const HomePricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  let navigate = useNavigate();

  const handleChange = () => {
    setIsYearly((prevValue) => !prevValue);
  };

  const handleGetStarted = () => {
    // Handle navigation to the signup page here
    navigate("/signup");
  };

  return (
    <div id="pricing" className="bg-[#FAF8F7] h-full py-16 px-2 md:px-0">
      <div className="flex flex-col justify-center items-center w-full md:w-1/3 mx-auto text-center font-inter font-[700]">
        <h2 className="text-4xl font-bold">
          Powerful features for <br />
          <span
            style={{
              backgroundImage: "linear-gradient(90deg,#1D4ED8, #55CBFB)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            powerful creators
          </span>
        </h2>
        <p className="my-3 text-lg font-[400]">
          Choose a plan that’s right for you
        </p>

        <div className="mt-12 relative flex flex-col font-[400] text-[#191D23]">
          <div className="flex flex-row gap-4 items-center">
            <p>Pay Monthly</p>
            <IOSSwitch onChange={handleChange} />
            <p>Pay Yearly</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 md:mt-auto md:ml-96">
        <div className="flex justify-center items-baseline w-[180px]">
          <img
            src={CurlyArrow}
            alt=""
            className="relative left-16 md:static h-16 flip-image"
          />
          <p className="relative top-2 right-10 md:static text-[#5E5ADB] text-lg font-semibold">
            Save 25%
          </p>
        </div>
      </div>

      <div className="flex mx-auto w-full md:w-5/6 font-inter font-[500]">
        <div className="md:grid md:grid-cols-3 gap-4 w-full">
          {PricingDetails.map((pricing, index) => (
            <div
              key={index}
              className={`my-4  text-center md:text-left rounded-lg px-4 py-6 ${
                pricing.name === "Professional"
                  ? "bg-[#C8C6FF] shadow-lg"
                  : "bg-white"
              }`}
            >
              <h4 className="text-lg font-bold">{pricing.name}</h4>
              <p className="text-sm line-clamp-2 pt-2 text-gray-600 font-[400]">
                {pricing.description}
              </p>
              <span className="flex items-center gap-2 my-6">
                <p className="text-4xl text-gray-600 font-extralight">
                  ${isYearly ? pricing.price * 12 : pricing.price}
                </p>
                <p
                  className={`text-sm font-light ${
                    pricing.name === "Professional"
                      ? "text-gray-900"
                      : "text-gray-600"
                  }`}
                >
                  / {isYearly ? "Year" : "Month"}
                </p>
              </span>

              <button
                onClick={handleGetStarted}
                className={`w-full py-2 px-4 text-sm rounded-sm text-[#5E5ADB] bg-white hover:bg-violet-100 ${
                  pricing.name === "Professional"
                    ? ""
                    : "border-[1.5px] border-[#5E5ADB]"
                } `}
              >
                Get Started Now
              </button>

              <div className="mt-6">
                {Features.map((feature, index) => (
                  <span key={index} className="flex items-center gap-2">
                    {index < pricing.featureCount ? (
                      <img
                        src={Tick}
                        alt=""
                        className="p-1.5 w-6 h-6 rounded-full bg-[#5E5ADB]"
                      />
                    ) : (
                      <img
                        src={Cross}
                        alt=""
                        className="p-1.5 w-6 h-6 rounded-full bg-[#F7F8F9]"
                      />
                    )}
                    <p
                      className={`text-md my-2 ${
                        index >= pricing.featureCount ? "text-gray-500" : ""
                      }`}
                    >
                      {feature}
                    </p>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePricing;
