import React from "react";
import { useNavigate } from "react-router-dom";

const HomeContactUs = () => {
  const navigate = useNavigate();

  const handleContactUsButtonClick = (params) => {
    navigate("/contact-us");
  };
  return (
    <div className="h-full bg-[#9F9CFF] px-2 md:px-0 font-tahoma">
      <div className="flex flex-col justify-center items-center gap-3 py-16">
        <h1 className="text-4xl md:text-6xl text-[#FAF8F7] text-center">
          Redefining Media Sharing with <br /> Unparalleled Security and
          Control.
        </h1>

        <button
          onClick={handleContactUsButtonClick}
          className="bg-[#C8C6FF] hover:bg-violet-200 rounded-md py-2 px-6 text-sm font-bold my-6"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default HomeContactUs;
