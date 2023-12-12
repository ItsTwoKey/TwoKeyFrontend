import React from "react";
import Vector from "../assets/Vector.svg";
import TwoPersonPermission from "../assets/twopersonPermission.gif";
import AccessTimeWindow from "../assets/accessTimeWindow.gif";
import CustomizableSecurity from "../assets/customizableSecurity.gif";
import LocationBasedAccess from "../assets/locationBasedAccess.gif";
import TrackingAndAudit from "../assets/trackingAndAudit.gif";

const security = [
  { level: "Low" },
  { level: "Enhanced" },
  { level: "High" },
  { level: "Ultimate" },
];

const HomeProduct = () => {
  return (
    <div
      id="product"
      className="bg-[#F1F1FF] h-full w-full px-2 md:px-0 text-[#1C1C1C]"
      style={{
        backgroundImage: `url(${Vector})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top right",
      }}
    >
      <div className="text-center w-full md:w-1/2 mx-auto py-20 flex flex-col gap-6">
        <h1 className="text-4xl md:text-6xl font-[500] font-familjenGrotesk">
          Where innovation meets security
        </h1>
        <span className="font-inter font-[400]">
          <p >Enhancing Security and Control over Shared Content</p>
          <p>
            {security.map((item, index) => (
              <span key={index}>
                <u>{item.level} Security</u>
                {index < security.length - 2
                  ? ", "
                  : index === security.length - 2
                  ? " and "
                  : ""}
              </span>
            ))}
          </p>
          <p>with TwoKey APIs and tools.</p>
        </span>
      </div>

      <div className="md:flex md:justify-center md:items-center pb-16 max-w-full text-center md:text-left">
        <div className="md:grid md:grid-cols-2 gap-6">
          <div className="w-full md:w-[500px] bg-[#9F9CFF5C] rounded-[24px]   p-4 my-4 md:my-auto">
            <img
              src={TwoPersonPermission}
              alt=""
              className="h-48 p-2 rounded-t-[14px] w-full"
            />
            <h4 className="px-2 text-md font-[500] font-familjenGrotesk">Two-Person Permission</h4>
            <p className="px-2 text-sm text-gray-600 font-inter font-[400]">
              Enforces dual authentication from both the sender and recipient
              before granting access to shared files.
            </p>
          </div>

          <div className="w-full md:w-[500px] flex flex-row gap-6 my-4 md:my-auto">
            <div className="bg-[#9F9CFF5C] rounded-[24px] p-4 w-1/2">
              <img
                src={AccessTimeWindow}
                alt=""
                className="h-36 md:h-48 p-2 rounded-t-[14px] w-full"
              />
              <h4 className="px-2 text-md font-semibold font-familjenGrotesk">Two-Person Permission</h4>
              <p className="px-2 text-sm text-gray-600 line-clamp-2 font-inter font-[400]">
                Allows senders to specify access time frames, further
                controlling when recipients can view shared content.
              </p>
            </div>
            <div className="bg-[#9F9CFF5C] rounded-[24px] p-4 w-1/2">
              <img
                src={CustomizableSecurity}
                alt=""
                className="h-36 md:h-48 p-2 rounded-t-[14px] w-full"
              />
              <h4 className="px-2 text-md font-semibold font-familjenGrotesk">Customizable Security </h4>
              <p className="px-2 text-sm text-gray-600 line-clamp-2 font-inter font-[400]">
                Offers a suite of options to tailor security settings, including
                blocking screenshots, tracking replay attempts, controlling
                downloading, and more.
              </p>
            </div>
          </div>

          <div className="w-full md:w-[500px] bg-[#9F9CFF5C] rounded-[24px] p-4 my-4 md:my-auto">
            <img
              src={LocationBasedAccess}
              alt=""
              className="h-56 p-2 rounded-t-[14px] w-full"
            />
            <h4 className="px-2 text-md font-semibold font-familjenGrotesk">
              Location-Based Access Notifications
            </h4>
            <p className="px-2 text-sm text-gray-600 font-inter font-[400]">
              Alerts senders when shared content is accessed from an unfamiliar
              location, preventing unauthorized usage and promoting access
              integrity.
            </p>
          </div>
          <div className="w-full md:w-[500px] bg-[#9F9CFF5C] rounded-[24px] p-4 my-4 md:my-auto">
            <img
              src={TrackingAndAudit}
              alt=""
              className="h-56 p-2 rounded-t-[14px] w-full"
            />
            <h4 className="px-2 text-md font-semibold font-familjenGrotesk">Tracking and Audit Trails</h4>
            <p className="px-2 text-sm text-gray-600 font-inter font-[400]">
              Maintains a comprehensive log of file access, enhancing
              transparency and accountability in content interactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProduct;
