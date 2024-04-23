import React from "react";
import { useLocation } from "react-router-dom";

import LightMode from "../assets/lightMode.svg";
import DarkMode from "../assets/darkMode.svg";
import { useDarkMode } from "../context/darkModeContext";

import SearchBar from "./SearchBar";
import secureLocalStorage from "react-secure-storage";

const TopBar = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const hideTopBar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/onboard" ||
    location.pathname === "/signup" ||
    location.pathname === "/change-password" ||
    location.pathname === "/onboarding" ||
    location.pathname.startsWith("/ai");

  if (hideTopBar || !secureLocalStorage.getItem("token")) {
    return null;
  }

  // Extracting the first two segments of the pathname
  const pathnameSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");
  let displayedPath = "";
  if (pathnameSegments.length >= 2) {
    displayedPath = pathnameSegments[0] + " / " + pathnameSegments[1];
  }

  return (
    <nav
      className={`sticky top-0 z-50 h-[72px] ${
        darkMode ? "bg-black" : "bg-[#F1F1FF]"
      } p-1`}
    >
      <div className=" mx-auto flex flex-row items-center justify-between h-16 px-8 ">
        <p
          className={`${
            darkMode ? "text-gray-300" : "text-gray-800"
          } capitalize`}
        >
          {displayedPath}
        </p>
        <div className="flex justify-between gap-2 md:gap-24">
          <SearchBar />
          <img
            src={darkMode ? DarkMode : LightMode}
            alt="LightMode"
            className="cursor-pointer ml-5"
            onClick={toggleDarkMode}
          />
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
