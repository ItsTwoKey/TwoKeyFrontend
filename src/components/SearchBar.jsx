import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SearchIcon from "@mui/icons-material/Search";
import { useDarkMode } from "../context/darkModeContext";
import { supabase } from "../helper/supabaseClient";

export default function SearchBar() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data from Supabase with text search
      const { data, error } = await supabase
        .from("user_info")
        .select("name,last_name")
        .ilike("name", `%${searchTerm}%`);

      if (error) {
        console.error(error);
      } else {
        setSearchResults(data);
        console.log(data);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <div onClick={handleClickOpen} className="relative w-10 md:w-96">
        <SearchIcon
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "10px",
            color: "#808080",
          }}
        />
        <input
          type="search"
          placeholder="Search"
          className={`w-full p-1 pl-12 ${
            darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
          } rounded-md`}
          style={{ outline: "none" }}
          readOnly
        ></input>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={"sm"}
        PaperProps={{
          style: {
            borderRadius: "15px",
          },
        }}
      >
        <DialogTitle
          style={{
            borderBottom: "1px solid #464F6029",
            margin: 0,
          }}
        >
          <input
            type="search"
            placeholder="Search"
            className={`w-full p-1 border-none ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700"
            }`}
            style={{ outline: "none" }}
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
          ></input>
        </DialogTitle>
        {searchTerm && (
          <DialogContent
            style={{
              margin: 0,
            }}
          >
            <div className="">
              <ul>
                {searchResults.map((result, index) => (
                  <li key={index}>{result.name}</li>
                ))}
              </ul>
            </div>
          </DialogContent>
        )}
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  );
}
