import React from "react";
import Hero from "../assets/hero.svg";
import Vector from "../assets/Vector.svg";

const HomeHero = () => {
  return (
    <div id="hero" className="bg-[#FAF8F7] h-full">
      <div className="w-screen flex justify-between p-2">
        <div className="w-[584px] p-16">
          <h1 className="text-6xl font-semibold">Safety, Security, Privacy</h1>
          <div className="py-16">
            <p>
              TwoKey is a cutting-edge platform that revolutionizes the way
              media files are shared by introducing a suite of robust security
              features
            </p>
            <button className="bg-[#C8C6FF] border rounded-md border-[#131149] my-4 py-2 px-4 text-sm font-semibold">
              Request a demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
