import React, { useState } from "react";
import pl from "../assets/Landing/pl.png";
import LandingSecurityFeatures from "./LandingSecurityFeatures";

//Widgets
import w1 from "../assets/Landing/Features/w1.png";
import w2 from "../assets/Landing/Features/w2.png";
import w3 from "../assets/Landing/Features/w3.png";
import w4 from "../assets/Landing/Features/w4.png";

//Chat
import c1 from "../assets/Landing/Features/c1.png";
import c2 from "../assets/Landing/Features/c2.png";
import c3 from "../assets/Landing/Features/c3.png";

//Security
import s1 from "../assets/Landing/Features/s1.png";
import s2 from "../assets/Landing/Features/s2.png";
import s3 from "../assets/Landing/Features/s3.png";
import s4 from "../assets/Landing/Features/s4.png";

//OCR
import o1 from "../assets/Landing/Features/o1.png";
import o2 from "../assets/Landing/Features/o2.png";

const options = [
  {
    title: "Widgets",
    description: "Encryption ensures secure transmission of content",
    thumbnail: w3,
    images: [w1, w2, w3, w4],
    bColor: "#1B7FFF",
  },
  {
    title: "Chat Feature",
    description: "Advanced encryption ensures stronger security",
    thumbnail: c2,
    images: [c1, c2, c3],
    bColor: "#7E4EE9",
  },
  {
    title: "Security Features",
    description:
      "Unique Identifiers invisibly mark files for tracking purposes",
    thumbnail: pl,
    images: [s1, s2, s3, s4],
    bColor: "#141097",
  },
  {
    title: "Colour coding and OCR",
    description: "Encryption ensures secure transmission of content",
    thumbnail: pl,
    images: [o1, o2],
    bColor: "#5E5ADB",
  },
];

const LandingSecurity = () => {
  const [selected, setSelected] = useState(options[0].title);

  const handleSelect = (option) => {
    setSelected(option);
  };

  return (
    <div className="flex flex-col items-center bg-black h-full">
      <h1
        style={{
          backgroundImage: "linear-gradient(to right, grey, #D3D3D3, #FFFFFF)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
        className="text-3xl md:text-5xl font-bold pt-24"
      >
        Your content's security
      </h1>
      <h1
        style={{
          backgroundImage: "linear-gradient(to right, grey, #D3D3D3, #FFFFFF)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          lineHeight: "1.2",
        }}
        className="text-3xl md:text-5xl font-bold pt-2"
      >
        at a glance
      </h1>
      <p className="text-white mt-5">
        Unlock peace of mind with just a glance; the more vibrant the colors,
        the tighter the security dance.
      </p>
      <div className="h-full w-4/5 bg-[#1A2020] rounded-xl mt-10 px-4 py-2">
        <div className="bg-white rounded-xl" style={{ height: "60vh" }}></div>
        <div className="flex justify-between mt-5">
          {options.map((option, index) => (
            <h1
              key={index}
              className="flex-1 text-white text-center pb-2 hover:cursor-pointer"
              style={{
                borderBottom:
                  selected === option.title ? "2px solid green" : "none",
              }}
              onClick={() => handleSelect(option.title)}
            >
              {option.title}
            </h1>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 w-4/5">
        {options.map((option) => (
          <LandingSecurityFeatures option={option} />
        ))}
      </div>
    </div>
  );
};

export default LandingSecurity;
