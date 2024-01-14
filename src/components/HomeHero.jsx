import React from "react";
import Hero from "../assets/hero.svg";
import { useNavigate } from "react-router-dom";

const HomeHero = () => {
  const navigate = useNavigate();

  const handleDemoButtonClick = (params) => {
    navigate("/contact-us");
  };

  return (
    <div
      id="hero"
      className="bg-[#FAF8F7] h-full  font-[400] text-[#273720] font-tahoma"
    >
      <div className="w-full flex justify-between p-2">
        <div className="w-full md:w-[584px] px-4 py-16 md:px-16">
          <h1 className="text-center md:text-left text-4xl md:text-6xl ">
            Safety, Security, Privacy
          </h1>
          <div className="text-center md:text-left py-16">
            <p className="">
              TwoKey is a cutting-edge platform that revolutionizes the way
              media files are shared by introducing a suite of robust security
              features
            </p>
            <button
              onClick={handleDemoButtonClick}
              className="bg-[#C8C6FF] hover:bg-violet-200 border rounded-md border-[#131149] my-4 py-2 px-4 text-sm font-[700] text-[#1C1C1C]"
            >
              Request a demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
