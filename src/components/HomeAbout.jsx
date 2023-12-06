import React from "react";
import GreenTick from "../assets/greenTick.svg";
import QuickShare from "../assets/quickShare.png";
import QuickShareBg from "../assets/quickShareBg.png";

const Securities = [
  {
    level: "Low Security",
    desc: "Encryption ensures secure transmission of content while authentication requirements are limited for access.",
  },
  {
    level: "Moderate Security",
    desc: "Advanced encryption ensures stronger security while recipients are required to authenticate their identity and have limited permissions.",
  },
  {
    level: "High Security",
    desc: "Unique Identifiers invisibly mark files for tracking purposes, complemented by dynamic watermarks through custom watermarking to enhance traceability.",
  },
  {
    level: "Ultimate Security",
    desc: "Complete Encryption ensures end-to-end security, offering the highest level of protection, while Offline Access Control restricts recipients from accessing content without an internet connection.",
  },
];

const HomeAbout = () => {
  return (
    <div id="about" className="h-full bg-[#F1F1FF] p-16">
      <div className="flex flex-col justify-center items-center">
        <h5 className="font-medium">SECURITY LEVELS</h5>
        <h1 className="text-5xl font-medium my-6">
          Your content's security at a glance
        </h1>
        <p className="text-sm">
          Unlock peace of mind with just a glance; the more vibrant the colors,
          the tighter the security dance.
        </p>
      </div>

      <div className="flex justify-between  p-8">
        <div className="px-24 my-8 relative flex">
          <img src={QuickShare} alt="" className="h-[450px] z-20" />
          <img
            src={QuickShareBg}
            alt=""
            className="absolute h-[450px] w-64 top-8 right-12 rounded-lg shadow-2xl"
          />
        </div>
        <div className="w-1/2 ">
          {Securities.map((security, index) => (
            <span key={index} className="flex flex-row items-center gap-3 py-2">
              <img
                src={GreenTick}
                alt=""
                className="bg-white rounded-full p-0.5 w-5 h-5"
              />
              <span className="">
                <h5 className="text-sm font-bold py-1">{security.level}</h5>
                <p className="text-md">{security.desc}</p>
              </span>
            </span>
          ))}

          <button className="bg-[#C8C6FF] rounded-md py-2 px-4 text-sm my-6">
            Get Started for free
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeAbout;
