import React from "react";
import DeviceTube from "./devicePage/DeviceTube";
import SearchTube from "./devicePage/SearchTube";

const Device = () => {
  return (
    <>
      <div className="py-4 px-8 rounded-md h-screen overflow-y-scroll scrollbar-hide">
        <h2 className="text-xl font-semibold p-2">Device Management</h2>
        <hr className="border border-white border-b-[#D8DEE4]" />
        <SearchTube />
        <DeviceTube />
      </div>
    </>
  );
};

export default Device;
