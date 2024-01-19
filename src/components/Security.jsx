import React, { useState, useEffect } from "react";
import AddGeoLocation from "../components/AddGeoLocation";
import AddSecPreSet from "../components/AddSecPreSet";
import axios from "axios";
import MapComponent from "./MapComponent";
import OfficeLocation from "./OfficeLocation";

const Security = () => {
  const [allowedLocations, setAllowedLocations] = useState([]);

  useEffect(() => {
    const getLocations = async () => {
      let token = JSON.parse(sessionStorage.getItem("token"));

      try {
        const locations = await axios.get(
          "https://twokeybackend.onrender.com/file/listLocation/",
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
  }, []);
  return (
    <div className="p-4 b">
      <div>
        <div className="flex justify-between">
          <h3 className="text-xl font-medium">Geo - Location Settings</h3>
          <MapComponent />
        </div>
        <hr className="border border-transparent border-b-gray-300 my-2" />
        <div className="flex flex-wrap gap-2">
          {allowedLocations &&
            allowedLocations.map((loc) => {
              console.log(loc)
              return <OfficeLocation key={loc.id} name={loc.properties.name} location={loc.geometry.coordinates} />
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
      </div>
    </div>
  );
};

export default Security;
