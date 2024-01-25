import React, { useState } from "react";
import Desktopicon from "../../assets/Desktopicon.svg";
import LocationIcon from "../../assets/DefaultMarkerComponent.svg";
import UserIcon from "../../assets/usericon.png";

export default function DeviceTube(props) {
  const [device, setDevice] = useState(false);
  const hanleClick = (e) => {
    e.stopPropagation();
    if (device && props.deviceName === props.deviceObj.device) {
      setDevice(false);
      props.select(null);
    } else {
      setDevice(true);
      props.select(props.deviceObj.device);
    }
  };
  return (
    <div className="my-4 rounded-lg py-4 px-8 bg-[#F1F1FF] shadow-sm w-full">
      <div className="flex justify-between items-center" onClick={hanleClick}>
        <h1 className="text-lg font-medium tracking-wider uppercase cursor-pointer">
          {props.deviceObj.device}
        </h1>
        <div className="flex gap-5 items-center cursor-pointer">
          <span className="text-sm font-normal">Device Type</span>
          <div className="flex items-center justfy-start gap-2">
            <img src={Desktopicon} alt="device" />
            <span className="text-sm font-normal">Desktop</span>
          </div>
        </div>
      </div>
      {props.deviceName === props.deviceObj.device && (
        <div
          className={`flex justify-between items-center pt-3 ${
            device ? "" : "hidden"
          }`}
        >
          <div className="flex gap-2 justify-center items-center">
            <img src={UserIcon} alt="" className="rounded-full w-6 h-6" />
            <span className="font-medium color-[#1C1C1C] text-sm tracking-wider capitalize">
              {props.deviceObj.name}
            </span>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <img src={LocationIcon} alt="" />
            <span className="text-[#1C1C1C] font-normal text-xs">
              Maharashtra, pune, xyz address 245123 india
            </span>
          </div>
          <button className="rounded-lg px-4 py-2 text-white bg-[#E95744] text-sm font-medium tracking-wider">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
