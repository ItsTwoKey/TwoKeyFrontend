import React, { useState } from "react";
import DeviceTube from "./devicePage/DeviceTube";
import SearchTube from "./devicePage/SearchTube";

const Device = () => {
  const [deviceName, setdeviceName] = useState(null);
  const updateDevice = (x) => setdeviceName(x);
  const sample = [
    { name: "ravi varma", device: "82kd-wi" },
    { name: "test user", device: "jh-w1i-56" },
    { name: "reuben", device: "ima14-wi" },
    { name: "ali electicwala", device: "u4g-d-wi" },
    { name: "sudanshu", device: "kp-ad-wi" },
  ];

  return (
    <>
      <div className="py-4 px-8 rounded-md h-screen overflow-y-scroll scrollbar-hide">
        <h2 className="text-xl font-semibold p-2">Device Management</h2>
        <hr className="border border-white border-b-[#D8DEE4]" />
        <SearchTube />
        {sample.map((dev, index) => (
          <DeviceTube
            deviceObj={dev}
            key={index}
            deviceName={deviceName}
            select={updateDevice}
          />
        ))}
      </div>
    </>
  );
};

export default Device;
