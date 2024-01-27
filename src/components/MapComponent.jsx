import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import axios from "axios";
import locatemeIcon from "../assets/locateme.svg";
import DefaultMarkerComponent from "../assets/DefaultMarkerComponent.svg";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
// import { useRef } from "react";

const MapComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 18.5962,
    lng: 73.9223,
  });

  // getting the users current location
  const currentLocation = (e) => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);

      setSelectedLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error(
        "Google Maps API key not found. Make sure to set it in the .env file."
      );
    }
  }, []);

  // adding new geolacation into database
  const addLocation = async () => {
    try {
      let token = JSON.parse(localStorage.getItem("token"));
      console.log("proceeding")
      const body = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [selectedLocation.lat, selectedLocation.lng],
        },
        properties: {
          name: "office3",
        },
      };
      if (selectedLocation) {
        const addLocation = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/file/createLocation/`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log("addLocation:", addLocation.data);
      }
      console.log("addLocation:", body);
    } catch (error) {
      console.log("Error while adding Location", error);
    }
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleMapClick = (e) => {
    const clickedLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setSelectedLocation(clickedLocation);
  };

  // fetching the readable from coordinates
  const coordinateLocation = async () => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const address = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocation.lat}, ${selectedLocation.lng}&sensor=false&key=${apiKey}`
    );
    console.log(address);
  };

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="text-sm rounded-md py-[5px] px-3 bg-[#5E5ADB] text-white"
        style={{
          boxShadow: "0px 0px 0px 1px #5E5ADB, 0px 1px 1px 0px #0000001A",
        }}
      >
        Add Geo-location
      </button>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "5px",
          },
        }}
      >
        <DialogTitle
          style={{
            padding: "8px 18px",
          }}
        >
          New Geo - location
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
            margin: 0,
            padding: 0,
          }}
        >
          <div className="w-[506px] flex flex-col relative">
            <GoogleMap
              mapContainerStyle={{ height: "320px", width: "100%" }}
              onClick={handleMapClick}
              center={selectedLocation}
              zoom={12}
              id={"map"}
              options={{
                zoomControl: false,
                fullscreenControl: false,
              }}
            >
              {selectedLocation && <Marker position={selectedLocation} />}
            </GoogleMap>
            <div
              className="absolute cursor-pointer flex z-2 w-70 px-3 self-center py-1 m-auto bg-white items-center rounded-lg bottom-5"
              onClick={currentLocation}
            >
              <img
                src={locatemeIcon}
                className="mx-1 my-1"
                style={{ height: 20, width: 20 }}
                alt=""
              />
              <span className="mx-1 text-sm font-sans tracking-wide font-medium text-[#5E5ADB]">
                Locate me
              </span>
            </div>
          </div>
        </DialogContent>
        <div className="flex flex-col bg-blue-50 px-2 py-4 gap-x-1.5">
          <div className="text-xs font-normal">Select Geo - Location</div>
          <div className="flex py-1 items-center justify-between">
            <div className="flex py-1 items-center">
              <img
                src={DefaultMarkerComponent}
                className="mx-1 my-1"
                style={{ height: 20, width: 16 }}
                alt=""
              />
              <span className="mx-1 text-sm font-sans tracking-wide font-medium color-Gray-700">
                Khoturd
              </span>
            </div>
            <button
              className="px-2 py-1 mx-2 rounded-lg shadow-sm border text-[#5E5ADB] bg-white border-gray-300"
              onClick={closeDialog}
              color="primary"
              style={{
                boxShadow:
                  "0px 0px 0px 1px #464F6029, box-shadow: 0px 1px 1px 0px #0000001A",
              }}
            >
              Change
            </button>
          </div>
          <div className="text-xs font-normal">
            Paud Road, Nagpur, Maharashtra
          </div>
        </div>
        <DialogActions sx={{ padding: "10px" }}>
          <button
            className="px-2 py-1 mx-2 rounded-lg shadow-sm border border-gray-300"
            onClick={closeDialog}
            color="primary"
          >
            Cancel
          </button>
          <button
            className="px-2 py-1 rounded-lg shadow-sm bg-[#5E5ADB] text-white"
            onClick={addLocation}
          >
            Confirm Location
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MapComponent;
