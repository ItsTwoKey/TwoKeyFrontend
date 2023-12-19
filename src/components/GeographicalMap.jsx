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

const colorScale = scaleLinear()
  .domain([0.29, 0.68])
  .range(["#C8C6FF", "#3A36A1"]);

// Hardcoded data array
const hardcodedData = [
  { ISO3: "USA", value: 0.4 },
  { ISO3: "CAN", value: 0.5 },
  { ISO3: "IND", value: 0.9 },
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
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147,
      }}
    >
      {/* <Sphere stroke="#ffccff" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} /> */}
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const d = data.find((s) => s.ISO3 === geo.id);
            return (
              <Tooltip
                key={geo.rsmKey}
                title={
                  <span>{`ISO3: ${geo.id}, Value: ${
                    d ? d.value : "N/A"
                  }`}</span>
                }
                placement="bottom"
              >
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={d ? colorScale(d.value) : "#ECECEC"}
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
  );
};

export default GeographicalMap;
