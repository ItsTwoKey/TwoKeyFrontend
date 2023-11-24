import React from "react";
import AddGeoLocation from "../components/AddGeoLocation";
import AddSecPreSet from "../components/AddSecPreSet";

const Security = () => {
  return (
    <div className="p-4">
      <div>
        <h3 className="text-xl font-medium">Geo - Location Settings</h3>
        <hr className="border border-transparent border-b-gray-300 my-2" />

        <AddGeoLocation />
      </div>
      <div>
        <h3 className="text-xl font-medium">Security Pre-sets</h3>
        <hr className="border border-transparent border-b-gray-300 my-2" />
        <AddSecPreSet />{" "}
      </div>
    </div>
  );
};

export default Security;
