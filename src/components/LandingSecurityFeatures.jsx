import React, { useState } from "react";
import arrow from "../assets/Landing/arrow.png";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const LandingSecurityFeatures = ({ option }) => {
  const [play, setPlay] = useState(false);

  const handleMouseEnter = () => {
    setPlay(true);
  };

  const handleMouseLeave = () => {
    setPlay(false);
  };

  return (
    <div
      key={option.title}
      className="bg-[#A1A1A1] bg-opacity-20 flex flex-col w-full mx-auto justify-between"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={option.title}
    >
      <div
        className="h-2/3 flex-grow rounded-t-lg"
        style={{ border: `8px solid ${option.bColor}` }}
      >
        <Carousel
          showStatus={false}
          showIndicators={false}
          showThumbs={false}
          showArrows={false}
          autoPlay={play}
          infiniteLoop={true}
          interval={1500}
          stopOnHover={false} // Ensure the carousel does not stop when hovering
        >
          {option.images.map((img, index) => (
            <img key={index} src={img} alt="feature" />
          ))}
        </Carousel>
      </div>
      <div className="flex text-white h-[15vh] md:h-36 lg:h-24 items-center justify-between">
        <div className="flex flex-col w-3/4 px-5 justify-center">
          <h1 className="text-xl md:text-2xl font-bold">{option.title}</h1>
          <p className="text-sm md:text-base">{option.description}</p>
        </div>
        <img src={arrow} alt="arrow" className="h-10 mr-10" />
      </div>
    </div>
  );
};

export default LandingSecurityFeatures;
