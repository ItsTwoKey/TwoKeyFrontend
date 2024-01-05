import React from "react";

const HomeContactUs = () => {
  return (
    <div className="h-full bg-[#9F9CFF] px-2 md:px-0 font-tahoma">
      <div className="flex flex-col justify-center items-center gap-3 py-16">
        <h1 className="text-4xl md:text-6xl text-[#FAF8F7] text-center">
          Redefining Media Sharing with <br /> Unparalleled Security and
          Control.
        </h1>

        <button className="bg-[#C8C6FF] rounded-md py-2 px-6 text-sm font-bold my-6">
          <a href="/contact-us" alt=".">
            Contact Us
          </a>
        </button>
      </div>
    </div>
  );
};

export default HomeContactUs;
