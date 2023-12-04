import React, { useState, useEffect } from "react";
import PasswordChangeForm from "../components/PasswordChangeForm";
import Security from "../components/Security";
import TeamManagement from "../components/TeamManagement";
import Device from "../components/Device";

const navigationItems = [
  { key: "PasswordChangeForm", label: "Account Settings" },
  { key: "Device", label: "Device" },
  { key: "TeamManagement", label: "Team Management" },
  { key: "Security", label: "Security" },
];

const Sidebar = () => {
  const [selectedNavItem, setSelectedNavItem] = useState("PasswordChangeForm");
  const [role, setRole] = useState("");

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("profileData"));
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
              {selectedNavItem === item.key && (
                <span className="border-2 border-[#0969DA] rounded-full my-1"></span>
              )}
              <li
                className={`px-2 py-1 w-full cursor-pointer rounded-md ${
                  selectedNavItem === item.key ? "activeSetting" : ""
                }`}
                onClick={() => handleNavItemClick(item.key)}
              >
                {item.label}
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
