import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chrome from "@uiw/react-color-chrome";
import { GithubPlacement } from "@uiw/react-color-github";

const AddSecPreSet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preSetName, setPreSetName] = useState("");
  const [checkboxValues, setCheckboxValues] = useState({
    geoLocation: false,
    uniqueIdentifiers: false,
    accessControl: false,
  });
  const [hex, setHex] = useState("#4F46E5");

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleCheckboxChange = (checkbox) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [checkbox]: !prevValues[checkbox],
    }));
  };

  const handleAddPreSets = () => {
    // Console log the input values
    console.log("Pre-Set Name:", preSetName);
    console.log("Checkbox Values:", checkboxValues);
    console.log("Color:", hex);

    // You can add your logic for handling the input values here

    // Close the dialog
    // closeDialog();
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
        Add Security Pre-sets
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
        <DialogTitle>Security Pre-sets</DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] py-2">
            <span className="w-[462px]">
              <p className="text-gray-700">Pre-Set Name</p>
              <input
                className="w-full border border-gray-300 rounded-md my-2 px-2 py-1"
                type="text"
                value={preSetName}
                onChange={(e) => setPreSetName(e.target.value)}
              />
            </span>
            <span className="flex flex-col my-2">
              <p className="text-gray-700 my-1">Security Features</p>
              <label>
                <input
                  type="checkbox"
                  checked={checkboxValues.geoLocation}
                  onChange={() => handleCheckboxChange("geoLocation")}
                />
                Geo - Location
              </label>
              {/* <label>
                <input
                  type="checkbox"
                  checked={checkboxValues.uniqueIdentifiers}
                  onChange={() => handleCheckboxChange("uniqueIdentifiers")}
                />
                Unique Identifiers
              </label> */}
              <label>
                <input
                  type="checkbox"
                  checked={checkboxValues.accessControl}
                  onChange={() => handleCheckboxChange("accessControl")}
                />
                Timeframe
              </label>
            </span>

            <span>
              <p className="text-gray-700 my-2">Security Color</p>
              <Chrome
                color={hex}
                style={{ width: "100%", margin: "auto" }}
                placement={GithubPlacement.Right}
                onChange={(color) => {
                  setHex(color.hexa);
                }}
              />
            </span>
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
            onClick={handleAddPreSets}
          >
            Add new pre-sets
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddSecPreSet;
