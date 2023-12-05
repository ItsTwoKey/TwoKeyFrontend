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
      className="bg-[#F1F1FF] h-full"
      style={{
        backgroundImage: `url(${Vector})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top right",
      }}
    >
      <div className="text-center w-1/2 mx-auto py-20 flex flex-col gap-6">
        <h1 className="text-6xl font-semibold ">
          Where innovation meets security
        </h1>
        <span>
          <p>Enhancing Security and Control over Shared Content</p>
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

      <div className="flex justify-center items-center pb-16">
        <div className="grid grid-cols-2 gap-6">
          <span className="w-[500px] bg-[#9F9CFF5C] rounded-[24px] p-4">
            <img
              src={TwoPersonPermission}
              alt=""
              className="h-48 p-2 rounded-t-[14px] w-full"
            />
            <h4 className="text-md font-semibold">Two-Person Permission</h4>
            <p className="text-sm text-gray-600">
              Enforces dual authentication from both the sender and recipient
              before granting access to shared files.
            </p>
          </span>

          <span className="w-[500px] flex flex-row gap-6">
            <span className="bg-[#9F9CFF5C] rounded-[24px] p-4 w-1/2">
              <img
                src={AccessTimeWindow}
                alt=""
                className="h-48 p-2 rounded-t-[14px] w-full"
              />
              <h4 className="text-md font-semibold ">Two-Person Permission</h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                Allows senders to specify access time frames, further
                controlling when recipients can view shared content.
              </p>
            </span>
            <span className="bg-[#9F9CFF5C] rounded-[24px] p-4 w-1/2">
              <img
                src={CustomizableSecurity}
                alt=""
                className="h-48 p-2 rounded-t-[14px] w-full"
              />
              <h4 className="text-md font-semibold ">Customizable Security </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                Offers a suite of options to tailor security settings, including
                blocking screenshots, tracking replay attempts, controlling
                downloading, and more.
              </p>
            </span>
          </span>

          <span className="w-[500px] bg-[#9F9CFF5C] rounded-[24px] p-4">
            <img
              src={LocationBasedAccess}
              alt=""
              className="h-56 p-2 rounded-t-[14px] w-full"
            />
            <h4 className="text-md font-semibold">
              Location-Based Access Notifications
            </h4>
            <p className="text-sm text-gray-600">
              Alerts senders when shared content is accessed from an unfamiliar
              location, preventing unauthorized usage and promoting access
              integrity.
            </p>
          </span>
          <span className="w-[500px] bg-[#9F9CFF5C] rounded-[24px] p-4">
            <img
              src={TrackingAndAudit}
              alt=""
              className="h-56 p-2 rounded-t-[14px] w-full"
            />
            <h4 className="text-md font-semibold">Tracking and Audit Trails</h4>
            <p className="text-sm text-gray-600">
              Maintains a comprehensive log of file access, enhancing
              transparency and accountability in content interactions.
            </p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeProduct;
