import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import threeDots from "../../assets/threedots.svg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function OfficeLocation(props) {
  const [lat, lng] = props.location;
  const coordinates = { lat, lng };

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error(
        "Google Maps API key not found. Make sure to set it in the .env file."
      );
    }
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex flex-col rounded-lg bg-[#F8F8FF] w-60">
      <div className="flex flex-col justify-center relative">
        <GoogleMap
          mapContainerStyle={{
            height: "120px",
            aspectRatio: "16/9",
            borderRadius: "8px 8px 0px 0px",
          }}
          center={coordinates}
          zoom={12}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {props.location && <Marker position={coordinates} />}
        </GoogleMap>
        <div
          className="absolute flex z-4 justify-center align-center"
          style={{
            background:
              "linear-gradient(350deg, rgba(255, 255, 255, 0.6) 18.89%, rgba(255, 255, 255, 0) 100%)",
            width: "100%",
            height: "100%",
          }}
        >
          <div className="flex w-48 justify-between align-center relative">
            <div className="flex flex-col justify-center align-start">
              <p className="font-bold text-base text-[#1C1C1C]">{props.name}</p>
              <p className="font-normal tracking-wider text-xs text-[#1C1C1C]">
                Mumbai, Maharashtra
              </p>
            </div>
            <div className="flex flex-col justify-center align-start relative">
              <img
                src={threeDots}
                height={40}
                width={40}
                alt=""
                onClick={handleMenuClick}
              />

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                PaperProps={{
                  style: {
                    border: "1px solid [#11182626]",
                    boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)",
                    borderRadius: "6px",
                  },
                }}
              >
                <MenuItem
                  style={{ padding: "2px 12px", color: "#464F60" }}
                  onClick={() => {
                    console.log("edit");
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    console.log("remove");
                  }}
                  style={{ padding: "2px 12px", color: "#D1293D" }}
                >
                  Remove
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col rounded-lg gap-y-3.5 px-3 py-3">
        <p className="text-base font-medium text-[#1C1C1C]">Address of this</p>
        <p className="text-sm tracking-wider font-normal text-[#78858F] break-words">
          IT Park, Karond road, near ampetheater, 462001
        </p>
        <p className="text-sm tracking-wider font-normal text-[#78858F]">
          Mumbai, Maharashtra, India
        </p>
      </div>
    </div>
  );
}
