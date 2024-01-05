import React, { useState } from "react";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";
import Tooltip from "@mui/material/Tooltip";
import geoUrl from "../assets/MapData/features.json";
import Refresh from "../assets/refresh.svg";

const colorScale = scaleLinear()
  .domain([0.29, 0.68])
  .range(["#C8C6FF", "#3A36A1"]);

// Hardcoded data array
const hardcodedData = [
  { ISO3: "USA", name: "United States", value: 4 },
  { ISO3: "GBR", name: "United Kingdom", value: 5 },
  { ISO3: "IND", name: "India", value: 7 },
  { ISO3: "BRA", name: "Brazil", value: 6 },
  // Add more data as needed
];

const GeographicalMap = () => {
  const [data] = useState(hardcodedData);
  const [hoveredGeo, setHoveredGeo] = useState(null);

  const handleMouseEnter = (geo) => {
    setHoveredGeo(geo);
  };

  const handleMouseLeave = () => {
    setHoveredGeo(null);
  };

  return (
    <div className="shadow-lg rounded-md py-6 border border-gray-100 ">
      <span className="px-4 flex justify-between items-center">
        <p className="text-sm font-semibold">Recent File access location</p>
        <button className="flex items-center gap-2">
          <img src={Refresh} alt="." />
          Refresh
        </button>
      </span>

      <hr className="border border-[#F6F6F6] mt-2" />

      <ComposableMap
        height={380}
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 142,
        }}
        // className="my-[-30px]"
      >
        {/* <Sphere stroke="#ffccff" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} /> */}
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const d = data.find((s) => s.ISO3 === geo.id);
              const scaledValue = d ? d.value / 10 : null;
              return (
                <Tooltip
                  key={geo.rsmKey}
                  title={
                    <span>{`${geo.properties.name} : ${
                      d ? d.value : "N/A"
                    }`}</span>
                  }
                  placement="bottom"
                >
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d ? colorScale(scaledValue) : "#ECECEC"}
                    stroke="#A9A9A9"
                    strokeWidth={0.3}
                    onMouseEnter={() => handleMouseEnter(geo)}
                    onMouseLeave={handleMouseLeave}
                  />
                </Tooltip>
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <div className="grid grid-cols-2 gap-x-64 px-4">
        {hardcodedData.map((item, index) => (
          <span
            key={index}
            className={`flex flex-row justify-between gap-2 text-xs font-semibold my-1 ${
              index % 2 !== 0 && "justify-end"
            }`}
          >
            <p className="">{item.name}</p>
            <p>{item.value} Visits</p>
          </span>
        ))}
      </div>
    </div>
  );
};

export default GeographicalMap;
