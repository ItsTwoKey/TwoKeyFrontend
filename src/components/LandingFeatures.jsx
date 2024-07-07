import React from "react";
import knot from "../assets/Landing/knot.png";
import dotted from "../assets/Landing/dotted.png";

const LandingFeatures = ({ mt, title, subTitle }) => {
  return (
    <div className="mx-1 lg:mx-2 md:w-1/3 lg:w-1/5">
      <div
        className={`hidden lg:block h-3/5 bg-gray-400 bg-opacity-10 border-[#E3E3E31A] rounded-2xl flex flex-col`}
        style={{ marginTop: mt }}
      >
        <div className="pl-5 pt-5">
          <img src={knot} alt="knot" className="w-1/12" />
          <h1 className="text-white mt-2 text-xl font-bold">{title}</h1>
          <h3 className="text-white italic">{subTitle}</h3>
        </div>
        <img src={dotted} alt="dotted-line" className="w-full mt-16" />
      </div>
      <div className="block lg:hidden h-4/5 bg-gray-400 bg-opacity-10 border-[#E3E3E31A] rounded-2xl flex flex-col">
        <div className="pl-5 pt-5">
          <img src={knot} alt="knot" className="w-1/12" />
          <h1 className="text-white mt-2 text-xl font-bold">{title}</h1>
          <h3 className="text-white italic">{subTitle}</h3>
        </div>
        <img src={dotted} alt="dotted-line" className="w-full mt-5" />
      </div>
      <div className="md:border border-[#E7E7E799] h-full mt-5 rounded-2xl hidden lg:block"></div>
    </div>
  );
};

export default LandingFeatures;
