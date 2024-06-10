import React, { useState, useEffect } from "react";
import AddGeoLocation from "../components/AddGeoLocation";
import AddSecPreSet from "../components/AddSecPreSet";
import axios from "axios";
import MapComponent from "./MapComponent";
import OfficeLocation from "./securityPage/OfficeLocation";
import SecurityPresets from "./securityPage/SecurityPresets";
import  secureLocalStorage  from  "react-secure-storage";

const Security = () => {
  const [allowedLocations, setAllowedLocations] = useState([]);
  const [presets, setPresets] = useState([]);

  const getPresets = async () => {
    let sample = [
      {
        name: "Low Level Security",
        color: "#BC007C",
        level: 30,
      },
      {
        name: "Mid Level Security",
        color: "#BCA900",
        level: 60,
      },
      {
        name: "High Level Security",
        color: "#00BC35",
        level: 100,
      },
    ];
    // implement fetch data for actual presets
    setPresets(sample);
  };

  useEffect(() => {
    const getLocations = async () => {
      let token = secureLocalStorage.getItem("token");

      try {
        const locations = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/file/listLocation`,
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        console.log("locations", locations.data.features);
        setAllowedLocations(locations.data.features);
      } catch (error) {
        console.log(error);
      }
    };
    getLocations();
    getPresets();
  }, []);
  return (
    <div className="p-4 b">
      <div>
        <div className="flex justify-between">
          <h3 className="text-xl font-medium">Geo - Location Settings</h3>
          <MapComponent />
        </div>
        <hr className="border border-transparent border-b-gray-300 my-2" />
        <div className="flex flex-wrap my-6 gap-2">
          {allowedLocations &&
            allowedLocations.slice(0, 4).map((loc) => {
              console.log(loc);
              return (
                <OfficeLocation
                  key={loc.id}
                  name={loc.properties.name}
                  location={loc.geometry.coordinates}
                />
              );
            })}
        </div>
        {/* <AddGeoLocation /> */}
      </div>
      <div>
        <div className="flex justify-between">
          <h3 className="text-xl font-medium">Security Pre-sets</h3>
          <AddSecPreSet />{" "}
        </div>
        <hr className="border border-transparent border-b-gray-300 my-2" />
        <div className="flex flex-wrap my-6 gap-2">
          {presets &&
            presets.slice(0, 3).map((loc, index) => {
              console.log(loc);
              return <SecurityPresets key={index} preset={loc} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default Security;
