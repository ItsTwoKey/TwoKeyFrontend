import React from "react";

const HomePricing = () => {
  return (
    <div id="pricing" className="bg-[#FAF8F7] h-screen">
      <div className="flex justify-center items-center w-1/3 mx-auto py-16 text-center">
        <h2 className="text-4xl font-bold">
          Powerful features for{" "}
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
      </div>
    </div>
  );
};

export default HomePricing;
