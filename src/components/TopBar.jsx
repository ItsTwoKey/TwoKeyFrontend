import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LightMode from "../assets/lightMode.svg";
import DarkMode from "../assets/darkMode.svg";
import { useDarkMode } from "../context/darkModeContext";
import { supabase } from "../helper/supabaseClient";

const TopBar = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data from Supabase with text search
      const { data, error } = await supabase
        .from("user_info") // Replace 'your_table' with your actual Supabase table name
        .select("*")
        .ilike("name", `%${searchTerm}%`);

      if (error) {
        console.error(error);
      } else {
        setSearchResults(data);
        // console.log(data);
      }
    };

    fetchData();
  }, [searchTerm]);

  const hideTopBar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/onboarding" ||
    location.pathname.startsWith("/ai");

  if (hideTopBar) {
    return null;
  }

  if (!sessionStorage.getItem("token")) {
    return null;
  }

  const topBarPath = location.pathname === "/dashboard";
  let currentLocation = location.pathname;

  const isUserProfile = /^\/User-Profile\/[0-9a-fA-F-]+$/i.test(
    location.pathname
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav
      className={`sticky top-0 z-50 h-[72px] ${
        darkMode ? "bg-gray-800" : "bg-[#F1F1FF]"
      } p-1`}
    >
      <div className="container mx-auto flex flex-row items-center justify-between h-16 px-8">
        <p
          className={`${
            darkMode ? "text-gray-300" : "text-gray-800"
          } capitalize`}
        >
          {isUserProfile
            ? "User-Profile"
            : location.pathname === "/dashboard"
            ? "Overview / Dashboard"
            : `${location.pathname}`.slice(1)}
        </p>
        <div className="flex justify-between gap-2 md:gap-24">
          <div className="relative w-10 md:w-96">
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
              value={searchTerm}
              onChange={handleSearchChange}
            ></input>
          </div>

          <img
            src={darkMode ? DarkMode : LightMode}
            alt="LightMode"
            className="cursor-pointer"
            onClick={toggleDarkMode}
          />
        </div>
      </div>
      {/* Display search results */}
      {/* <ul>
        {searchResults.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul> */}
    </nav>
  );
};

export default TopBar;
