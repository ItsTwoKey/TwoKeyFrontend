import React, { useState } from "react";
import Desktopicon from "../../assets/Desktopicon.svg";

export default function DeviceTube() {
  const [device, setDevice] = useState(false);
  const showDevice = () => {
    device ? setDevice(false) : setDevice(true);
    console.log(device);
  };
  return (
    <div
      className="my-4 rounded-lg py-4 px-8 bg-[#F1F1FF] shadow-sm w-full"
      onClick={showDevice}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium tracking-wider uppercase">
          DQL-458-K
        </h1>
        <div className="flex gap-5 items-center">
          <span className="text-sm font-normal">Device Type</span>
          <div className="flex items-center justfy-start gap-2">
            <img src={Desktopicon} alt="device" />
            <span className="text-sm font-normal">Desktop</span>
          </div>
        </div>
      </div>
      <div
        className={`flex justify-between items-center ${
          device ? "" : "hidden"
        }`}
      >
        <h1 className="text-lg font-medium tracking-wider uppercase">
          DQL-458-K
        </h1>
        <div className="flex gap-5 items-center">
          <span className="text-sm font-normal">Device Type</span>
          <div className="flex items-center justfy-start gap-2">
            <img src={Desktopicon} alt="device" />
            <span className="text-sm font-normal">Desktop</span>
          </div>
        </div>
      </div>
    </div>
  );
}
