import React from "react";
import { useLocation } from "react-router-dom";

import LightMode from "../assets/lightMode.svg";
import DarkMode from "../assets/darkMode.svg";
import { useDarkMode } from "../context/darkModeContext";

import SearchBar from "./SearchBar";
import  secureLocalStorage  from  "react-secure-storage";

const TopBar = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const hideTopBar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/onboarding" ||
    location.pathname.startsWith("/ai");

  if (hideTopBar) {
    return null;
  }

  if (!secureLocalStorage.getItem("token")) {
    return null;
  }

  const topBarPath = location.pathname === "/dashboard";
  let currentLocation = location.pathname;

  const isUserProfile = /^\/User-Profile\/[0-9a-fA-F-]+$/i.test(
    location.pathname
  );

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
          <SearchBar />

          <img
            src={darkMode ? DarkMode : LightMode}
            alt="LightMode"
            className="cursor-pointer"
            onClick={toggleDarkMode}
          />
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
