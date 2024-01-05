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
  const [filteredFiles, setFilteredFiles] = useState([]);

  useEffect(() => {
    const filesData = JSON.parse(localStorage.getItem("accountFilesCache"));
    console.log("filesData", filesData);

    // Filter files based on the search term
    const filteredFiles = filesData.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFiles(filteredFiles);
  }, [searchTerm]);

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
            borderRadius: "8px",
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
              padding: 0,
            }}
          >
            <div className="">
              {filteredFiles && (
                <div className="my-2">
                  <h3 className="text-md font-semibold p-4 border-b-[1px] border-gray-100">
                    Files:
                  </h3>
                  <ul>
                    {filteredFiles.map((file, index) => (
                      <li
                        key={index}
                        className="p-4 border-b-[1px] border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* <hr className="" /> */}

              {searchResults && (
                <div className="my-2">
                  <h3 className="text-md font-semibold p-4 border-b-[1px] border-gray-100">
                    Users:
                  </h3>
                  <ul>
                    {searchResults.map((result, index) => (
                      <li
                        key={index}
                        className="p-4 border-b-[1px] border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        {result.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </React.Fragment>
  );
}
