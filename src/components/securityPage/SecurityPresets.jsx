import React, { useState } from "react";
import threeDots from "../../assets/threedots.svg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";


export default function SecurityPresets(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex flex-col px-8 py-4 rounded-2xl m-2  bg-[#F8F8FF] w-60">
      <div className="flex flex-col justify-center py-2">
        <div className="flex justify-between align-center">
          <p className="font-medium text-sm">{props.preset.name}</p>
          <img
            src={threeDots}
            alt=""
            height={20}
            width={20}
            onClick={handleMenuClick}
            className="block"
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
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
      <div className="rounded-full mt-3 w-44 h-2 bg-[#E2E2E2] relative">
      <div className={`rounded-full h-2`} style={{width: `${props.preset.level}%`, backgroundColor: props.preset.color}}></div>
      </div>
      </div>
    </div>
  );
}

SecurityPresets.defaultProps = {
  preset:{
    name:"Low Level Security",
    color:"#BC007C",
    level:30
  }
}
