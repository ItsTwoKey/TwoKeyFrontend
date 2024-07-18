import React, { useState } from "react";
import pl from "../assets/Landing/pl.png";
import arrow from "../assets/Landing/arrow.png";

const options = [
  {
    title: "Widgets",
    description: "Encryption ensures secure transmission of content",
    image: pl,
    bColor: "#1B7FFF",
  },
  {
    title: "Chat Feature",
    description: "Advanced encryption ensures stronger security",
    image: pl,
    bColor: "#7E4EE9",
  },
  {
    title: "Security Features",
    description:
      "Unique Identifiers invisibly mark files for tracking purposes",
    image: pl,
    bColor: "#141097",
  },
  {
    title: "Colour coding and OCR",
    description: "Encryption ensures secure transmission of content",
    image: pl,
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
          <div
            key={option.title}
            className="bg-[#A1A1A1] bg-opacity-20 flex flex-col w-full mx-auto justify-between pb-8"
          >
            <div
              className="h-2/3 flex-grow rounded-t-lg"
              style={{ border: `8px solid ${option.bColor}` }}
            >
              <img
                src={option.image}
                alt="img"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex text-white h-[15vh] md:h-36 lg:h-24 items-center justify-between mt-2">
              <div className="flex flex-col w-3/4 px-5 justify-center">
                <h1 className="text-xl md:text-2xl font-bold">
                  {option.title}
                </h1>
                <p className="text-sm md:text-base">{option.description}</p>
              </div>
              <img src={arrow} alt="arrow" className="h-10 mr-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingSecurity;
