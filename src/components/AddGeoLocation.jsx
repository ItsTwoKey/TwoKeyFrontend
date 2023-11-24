import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// AIzaSyCz2wui9Ei43eFaUCJUdowugfb1sGKaTcM
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const AddGeoLocation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const center = {
    lat: 18.5962,
    lng: 73.9223,
  };
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="text-sm rounded-md py-[5px] px-3 border border-gray-300 bg-gray-50"
      >
        Add New Geo-location
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
        <DialogTitle>New Geo - location</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] p-3">
            <LoadScript googleMapsApiKey="AIzaSyCz2wui9Ei43eFaUCJUdowugfb1sGKaTcM">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
              >
                {/* Add your map components, markers, etc. here */}
              </GoogleMap>
            </LoadScript>
          </div>
        </DialogContent>
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
            onClick={() => alert("Confirm Location Clicked!")}
          >
            Confirm Location
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddGeoLocation;
