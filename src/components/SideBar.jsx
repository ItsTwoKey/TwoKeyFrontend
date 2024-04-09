import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfilePic from "../assets/profilePic.png";
import { useDarkMode } from "../context/darkModeContext";
import { useDepartment } from "../context/departmentContext";
import ProfilePicDummy from "../assets/profilePicDummy.jpg";
import axios from "axios";
import { Link } from "react-router-dom";
// Mui Icons And Drawers
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { departmentIcons } from "../utils/iconComponents";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import MenuIcon from "@mui/icons-material/MenuRounded";
import Cross from "../assets/cross.svg";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Analytics from "../assets/Analytics.svg";
import UserMgmt from "../assets/userMgmt.svg";
import { useAuth } from "../context/authContext";
import secureLocalStorage from "react-secure-storage";
import CloseIcon from "@mui/icons-material/Close";

let hardCodedDepartments = [
  { name: "Account", metadata: { bg: "#FFF6F6", border: "#FEB7B7" } },
  { name: "Finance", metadata: { bg: "#FFF6FF", border: "#FFA9FF" } },
  { name: "Development", metadata: { bg: "#F6FFF6", border: "#B3FFB3" } },
  { name: "Manufacturing", metadata: { bg: "#F6F7FF", border: "#B6BEFF" } },
  { name: "Sales", metadata: { bg: "#FFFFF6", border: "#FFFFA1" } },
  { name: "Human Resources", metadata: { bg: "#F6FFFE", border: "#C0FFF8" } },
];

/**
 * Sidebar component for navigation and user-related actions.
 * @returns {JSX.Element} The Sidebar component.
 */
function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const { darkMode } = useDarkMode();
  const [picture, setPicture] = useState(null);
  const { profileData, setProfileData, setToken } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    // change the active status
    let token = JSON.parse(secureLocalStorage.getItem("token"));
    let body = {
      id: token.user.id,
      is_active: false,
    };
    // console.log("onboarding body:", body);
    try {
      const res = axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/updateProfile`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    navigate("/");
    setProfileData(null);
    setToken(null);
    secureLocalStorage.removeItem("token");
    // localStorage.removeItem("profileData");
    secureLocalStorage.clear();
  }

  const hideSideBar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/change-password" ||
    location.pathname === "/onboarding";

  if (hideSideBar) {
    return null;
  }

  /**
   * If the user is unauthorised then no need to show the side panel.
   * Feel free to delete if needed.
   */
  if (!secureLocalStorage.getItem("token") || hideSideBar) {
    return null;
  }
  const lightModeSidebarColor = "[#f7f7ff]";
  return (
    <nav
      className={`min-h-[100%] ${
        darkMode ? "bg-gray-800" : `bg-${lightModeSidebarColor}`
      } `}
    >
      <div
        className={`w-[72px] h-[72px] p-4 flex justify-center items-center sticky top-0 ${
          darkMode && "text-black"
        }`}
      >
        <IconButton
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          color="inherit"
          edge="start"
          sx={{
            display: { md: "none", xs: "block" },
          }}
        >
          <MenuIcon />
        </IconButton>
      </div>

      {/* 
      Small screen Drawer
       */}
      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        variant="temporary"
        sx={{
          display: { md: "none", xs: "block" },
          borderBottom: 2,
          minHeight: "100%",

          "& .MuiDrawer-paper": {
            backgroundColor: `${darkMode ? "black" : "white"}`,
            minHeight: "100%",
          },
        }}
      >
        {/* the main background css to be changed */}
        <nav
          className={`sm-width md-width px-2 h-screen  ${
            darkMode ? "bg-black" : `bg-${lightModeSidebarColor}`
          } `}
        >
          <div className="w-full">
            <div className="flex justify-between items-center p-4">
              <a
                href="/dashboard"
                alt="LOGO"
                className={`text-xl md:text-2xl ${
                  darkMode
                    ? "hover:text-gray-400 text-gray-300"
                    : "text-gray-500 hover:text-gray-600"
                }`}
              >
                Twokey
              </a>
              <IconButton
                onClick={() => {
                  setIsMenuOpen(false); // Close the drawer
                }}
              >
                <CloseIcon style={{ color: darkMode ? "white" : "black" }} />
              </IconButton>
            </div>

            <SideBarContents darkMode={darkMode} />
            <div className="my-12"></div>

            {/* Profile and logout buttons */}
            <footer
              className={`relative w-full py-5 bottom-12 ${
                darkMode ? "bg-black" : `bg-${lightModeSidebarColor}`
              }`}
            >
              <span className="flex justify-between items-center px-4">
                <a
                  href="/profile"
                  alt="Profile"
                  className={`p-2 rounded-md ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700"
                      : "hover:bg-gray-100"
                  } flex justify-start items-center font-medium duration-200`}
                >
                  <img
                    src={picture ? picture : ProfilePic}
                    loading="lazy"
                    alt={data ? `${data}'s Profile Picture` : "Profile Picture"}
                    className={`w-6 h-6 rounded-full ${
                      darkMode
                        ? "filter brightness-100 border border-white"
                        : ""
                    }`}
                  />
                  <p className="px-2">#{data ? data : "Profile"}</p>
                </a>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 rounded-lg p-1"
                >
                  <ExitToAppRoundedIcon sx={{ color: "white" }} size="small" />
                </button>
              </span>
            </footer>
          </div>

          {/* <div
            className={` bottom-10 ${
              darkMode ? "bg-gray-800" : `bg-${lightModeSidebarColor}`
            }`}
          >
            <footer className="w-full py-2 ">
              <span className="flex justify-between items-center">
                <a
                  href="/profile"
                  alt="Profile"
                  className={` p-2 rounded-md  
                  ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700]"
                      : "hover:bg-gray-100"
                  } flex justify-start items-center font-medium duration-200`}
                >
                  <img
                    src={picture ? picture : ProfilePic}
                    loading="lazy"
                    alt={data ? `${data}'s Profile Picture` : "Profile Picture"}
                    className={`w-6 h-6 rounded-full ${
                      darkMode
                        ? "filter brightness-100 border border-white"
                        : ""
                    }`}
                  />
                  <p className="px-2">#{data ? data : "Profile"}</p>
                </a>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 rounded-lg p-1"
                >
                  <ExitToAppRoundedIcon sx={{ color: "white" }} size="small" />
                </button>
              </span>
            </footer>
          </div> */}
        </nav>
      </Drawer>
      {/* 
      Medium and Large screen Drawer
       */}
      <Drawer
        anchor="top"
        open
        variant="persistent"
        sx={{
          width: { md: 224, lg: 240, xs: 72 },
          display: { md: "block", xs: "none" },
          flexShrink: 0,
          backgroundColor: `${darkMode ? "#1f2937" : "white"}`,

          "& .MuiDrawer-paper": {
            width: { md: 224, lg: 240, xs: 72 },
            display: { md: "block", xs: "none" },
            backgroundColor: `${darkMode ? "#1f2937" : "white"}`,
            minHeight: "auto",
            border: "none",
          },
          "& .MuiDrawer-paper::-webkit-scrollbar": {
            display: "none" /* Hide scrollbar for Chrome, Safari, and Edge */,
          },
        }}
      >
        <nav
          className={` ${!isMenuOpen && "hide-sidebar h-auto w-full"}  ${
            darkMode ? "bg-gray-800" : `bg-${lightModeSidebarColor}`
          }`}
        >
          <div className="w-full ">
            <div
              className={`flex justify-between items-center sticky top-0 py-4 px-6 ${
                darkMode ? "bg-gray-800" : `bg-${lightModeSidebarColor}`
              }`}
            >
              <Link
                to="/dashboard" // Use "to" instead of "href"
                alt="LOGO"
                className={`text-xl font-allertaStencil md:text-2xl ${
                  darkMode
                    ? "hover:text-gray-400 text-gray-300 "
                    : "text-gray-500 hover:text-gray-600 "
                }`}
              >
                Twokey
              </Link>
            </div>
            <SideBarContents
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              darkMode={darkMode}
            />
          </div>
          <div
            className={`sticky bottom-0 ${
              darkMode ? "bg-gray-800" : `bg-${lightModeSidebarColor}`
            }`}
          >
            <footer className="w-full py-2 px-4 sticky bottom-0">
              <span className="flex justify-between items-center">
                <Link
                  to="/profile" // Use "to" instead of "href"
                  alt="Profile"
                  className={`p-2 rounded-md font-medium items-center flex justify-start duration-200
                  ${
                    location.pathname === "/profile"
                      ? ` p-2 rounded-md text-sm ${
                          darkMode
                            ? "hover:bg-gray-700 bg-gray-600"
                            : "bg-indigo-200  hover:bg-indigo-200"
                        } duration-200`
                      : `${
                          darkMode
                            ? "hover:bg-gray-700 text-gray-100"
                            : "hover:bg-indigo-100"
                        } p-2 rounded-md text-sm duration-200`
                  }`}
                >
                  <img
                    src={
                      profileData ? profileData.profile_pic : ProfilePicDummy
                    }
                    alt="ProfilePic"
                    className={`w-6 h-6 rounded-full ${
                      darkMode
                        ? "filter brightness-100 border border-white"
                        : ""
                    }`}
                  />
                  <p className="px-2">
                    #{profileData ? profileData.username : "Profile"}
                  </p>
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 rounded-lg p-1"
                >
                  <ExitToAppRoundedIcon sx={{ color: "white" }} size="small" />
                </button>
              </span>
            </footer>
          </div>
        </nav>
      </Drawer>
    </nav>
  );
}

/**
 * Renders the contents of the Sidebar based on the provided departments.
 * @param {Object} props - The component props.
 * @param {Array} props.departments - The list of department objects.
 * @param {boolean} props.darkMode - The dark mode state.
 * @returns {JSX.Element} The SidebarContents component.
 */
function SideBarContents({ darkMode, isMenuOpen, setIsMenuOpen }) {
  const { profileData, setProfileData, setToken } = useAuth();
  // const [departments, setDepartments] = useState([]);
  const { departments, setDepartments, listDepartments } = useDepartment();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    listDepartments();
  }, []);

  return (
    <>
      <ul
        className={`overflow-y-auto h-full ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        <p
          className={`text-xs py-2 px-6 ${
            darkMode ? "text-gray-200" : "text-gray-600"
          }`}
        >
          Overview
        </p>
        <div className="flex items-center px-4">
          <li className="min-w-full">
            <Link
              to="/dashboard" // Use "to" instead of "href"
              alt="Dashboard"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              className={`flex justify-start items-center min-w-full ${
                location.pathname === "/dashboard"
                  ? ` p-2 rounded-md text-sm ${
                      darkMode
                        ? "hover:bg-gray-700 bg-gray-600"
                        : "bg-indigo-200  hover:bg-indigo-200"
                    } duration-200`
                  : `${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-100"
                        : "hover:bg-indigo-100"
                    } p-2 rounded-md text-sm duration-200`
              }`}
            >
              <DashboardRoundedIcon />
              <p className="px-2">Dashboard</p>
            </Link>
          </li>
        </div>

        <p
          className={`text-xs mt-4 py-2 px-6 ${
            darkMode ? "text-gray-200" : "text-gray-600"
          }`}
        >
          Department
        </p>

        {departments.map((department, index) => (
          <li
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            key={index}
            className="min-w-full my-2 "
          >
            <style>
              {`
              .dept-${index}, .dept-hover-${index}:hover {
                background-color: ${department.metadata.bg};
              }
            `}
            </style>
            <Link
              to={`/department/${department.name}`} // Use "to" instead of "href"
              alt={department.name}
              className={`flex justify-start items-center min-w-full border border-[#ffffff00] py-2 px-6 rounded-md text-sm  duration-100 ${
                location.pathname.endsWith(department.name)
                  ? ` ${
                      darkMode
                        ? "hover:bg-gray-700 bg-gray-600"
                        : `hover:bg-indigo-400 bg-indigo-300`
                    }`
                  : `${darkMode ? "hover:bg-indigo-700 " : "hover:bg-gray-300"}`
              }`}
            >
              {departmentIcons[department.name]}
              <p className={`px-2 bg-[rgb(255 255 255 / 0%)] `}>
                {department.name.replace("_", " ")}
              </p>
            </Link>
          </li>
        ))}

        {profileData && profileData.role_priv === "org_admin" ? (
          <div className="px-4">
            <p
              className={`text-xs p-2 ${
                darkMode ? "text-gray-200" : "text-gray-600"
              }`}
            >
              Organization Admin
            </p>
            <div className="flex items-center">
              <li
                className="min-w-full"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                }}
              >
                <Link
                  to="/user-management" // Use "to" instead of "href"
                  alt="User Management"
                  className={`flex justify-start items-center min-w-full ${
                    location.pathname === "/user-management"
                      ? ` p-2 rounded-md text-sm ${
                          darkMode
                            ? "hover:bg-gray-700 bg-gray-600"
                            : "bg-indigo-200  hover:bg-indigo-200"
                        } duration-200`
                      : `${
                          darkMode
                            ? "hover:bg-gray-700 text-gray-100"
                            : "hover:bg-indigo-100"
                        } p-2 rounded-md text-sm duration-200`
                  }`}
                >
                  <img
                    src={UserMgmt}
                    style={darkMode ? { filter: "invert()" } : {}}
                    alt="."
                  />
                  <p className="px-2">User Management</p>
                </Link>
              </li>
            </div>

            {/* <div className="flex items-center mt-2">
              <li className="min-w-full" onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}>
                <Link
                  to="/analytics" // Use "to" instead of "href"
                  alt="Analytics"
                  className={`flex justify-start items-center min-w-full ${
                    location.pathname === "/analytics"
                      ? ` p-2 rounded-md text-sm ${
                          darkMode
                            ? "hover:bg-gray-700 bg-gray-600"
                            : "bg-indigo-200  hover:bg-indigo-200"
                        } duration-200`
                      : `${
                          darkMode
                            ? "hover:bg-gray-700 text-gray-100"
                            : "hover:bg-indigo-100"
                        } p-2 rounded-md text-sm duration-200`
                  }`}
                >
                  <img
                    src={Analytics}
                    style={darkMode ? { filter: "invert()" } : {}}
                    alt="."
                  />
                  <p className="px-2">Analytics & Report</p>
                </Link>
              </li>
            </div> */}
          </div>
        ) : (
          ""
        )}

        <p
          className={`text-xs mt-2 mb-2 py-2 px-6 ${
            darkMode ? "text-gray-200" : "text-gray-600 "
          }`}
        >
          Settings
        </p>
        <li
          className="min-w-full my-2 px-4"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <div className="flex items-center">
            <Link
              to="/settings" // Use "to" instead of "href"
              alt="settings"
              className={`flex justify-start items-center min-w-full ${
                location.pathname === "/settings"
                  ? ` duration-200 p-2 rounded-md text-sm ${
                      darkMode
                        ? "hover:bg-gray-700 bg-gray-600"
                        : "bg-indigo-200  hover:bg-indigo-200"
                    }`
                  : `hover:bg-indigo-100 p-2 rounded-md text-sm ${
                      darkMode && "hover:bg-indigo-600 text-gray-100"
                    } duration-200`
              }`}
            >
              <TuneRoundedIcon />
              <p className="px-2">Settings</p>
            </Link>
          </div>
        </li>
        {/* <li className="min-w-full my-2 px-4">
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className={`flex justify-start items-center min-w-full ${
                location.pathname === "#"
                  ? `
                  duration-200 p-2 rounded-md ${
                    darkMode
                      ? "hover:bg-gray-600 bg-gray-700"
                      : "bg-indigo-200  hover:bg-indigo-200"
                  } text-sm`
                  : `hover:${
                      darkMode ? "bg-gray-600" : "bg-indigo-100"
                    } p-2 rounded-md text-sm ${
                      darkMode ? "text-indigo-100" : ""
                    } duration-200`
              }`}
            >
              <ExitToAppRoundedIcon />
              <p className="px-2">LogOut</p>
            </button>
          </div>
        </li> */}
      </ul>
    </>
  );
}

export default SideBar;
