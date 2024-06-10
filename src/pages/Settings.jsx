import React, { useState, useEffect } from "react";
import PasswordChangeForm from "../components/PasswordChangeForm";
import Security from "../components/Security";
import TeamManagement from "../components/TeamManagement";
import Device from "../components/Device";
import Lobby from "../components/Lobby";
import Department from "../components/Department";
import AccountSetIcon from "../assets/AccountSetting.svg";
import DeviceIcon from "../assets/Devices.svg";
import TeamIcon from "../assets/TeamManagement.svg";
import SecurityIcon from "../assets/Security.svg";
import DepartmentIcon from "../assets/Department.svg";
import secureLocalStorage from "react-secure-storage";

const navigationItems = [
  {
    key: "PasswordChangeForm",
    label: "Account Settings",
    icon: AccountSetIcon,
  },
  { key: "Device", label: "Device", icon: DeviceIcon },
  { key: "TeamManagement", label: "Team Management", icon: TeamIcon },
  { key: "Security", label: "Security", icon: SecurityIcon },
  { key: "Department", label: "Department", icon: DepartmentIcon },
  { key: "Lobby", label: "Lobby", icon: DepartmentIcon },
];

const Sidebar = () => {
  const [selectedNavItem, setSelectedNavItem] = useState("PasswordChangeForm");
  const [role, setRole] = useState("");

  useEffect(() => {
    let data = JSON.parse(secureLocalStorage.getItem("profileData"));
    setRole(data.role_priv);
  }, []);

  const handleNavItemClick = (navItem) => {
    setSelectedNavItem(navItem);
  };

  const renderSelectedComponent = () => {
    switch (selectedNavItem) {
      case "PasswordChangeForm":
        return <PasswordChangeForm />;
      case "Device":
        return <Device />;
      case "TeamManagement":
        return <TeamManagement />;
      case "Security":
        return <Security />;
      case "Department":
        return <Department />;
      case "Lobby":
        return <Lobby />;
      default:
        return <PasswordChangeForm />;
    }
  };

  const filteredNavigationItems = navigationItems.filter(
    (item) => role === "org_admin" || item.key === "PasswordChangeForm"
  );

  return (
    <div className="flex">
      <nav className="w-1/5 p-3">
        <ul>
          {filteredNavigationItems.map((item) => (
            <div key={item.key} className="flex flex-row gap-1">
              <span
                className={`border-2 rounded-full my-1 ${
                  selectedNavItem === item.key
                    ? "border-[#0969DA]"
                    : "border-white"
                }`}
              ></span>
              <li
                className={`px-2 py-4 w-full cursor-pointer rounded-md ${
                  selectedNavItem === item.key ? "activeSetting" : ""
                }`}
                onClick={() => handleNavItemClick(item.key)}
              >
                <div className="flex gap-2">
                  <img src={item.icon} alt="" />
                  <div
                    className={
                      selectedNavItem === item.key ? "font-medium" : ""
                    }
                  >
                    {item.label}
                  </div>
                </div>
              </li>
            </div>
          ))}
        </ul>
      </nav>
      <div className="w-4/5">{renderSelectedComponent()}</div>
    </div>
  );
};

export default Sidebar;
