import React, { useState, useEffect } from "react";
import { supabase } from "../helper/supabaseClient";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar1 from "../assets/avatars/avatar1.png";
import Avatar2 from "../assets/avatars/avatar2.png";
import Avatar3 from "../assets/avatars/avatar3.png";

const RoleCount = () => {
  const [roles, setRoles] = useState([]);
  const [roleCount, setRoleCount] = useState({});

  useEffect(() => {
    const getRoles = async () => {
      try {
        let { data: user_info, error } = await supabase
          .from("user_info")
          .select("role_priv");

        console.log("roles:", user_info);
        setRoles(user_info);

        const countedRoles = countRoles(user_info);
        setRoleCount(countedRoles);
      } catch (error) {
        console.log("Error fetching departments");
      }
    };

    getRoles();
  }, []);

  const countRoles = (rolesData) => {
    const roleCountData = {};
    rolesData.forEach((role) => {
      roleCountData[role.role_priv] = (roleCountData[role.role_priv] || 0) + 1;
    });
    return roleCountData;
  };

  return (
    <div className="h-[315px] bg-white p-4 rounded-md shadow-lg my-4">
      <h3 className="font-semibold text-lg">Administrator roles available</h3>
      <p className="leading-5 text-sm text-gray-600 font-normal w-4/5">
        A role provides access to predefined menus and features so that
        depending on the assigned roles (Organization Admin, Manager, Department
        heads, Employees) an administrator can have access to what he/she needs.
      </p>

      <div className="h-[175px] mt-6 grid grid-cols-4 gap-4">
        {roles ? (
          Object.entries(roleCount).map(([role, count], index) => (
            <span
              key={index}
              className="border border-gray-100 py-2 px-3 rounded-md shadow-sm"
            >
              <span className="flex flex-row justify-between items-center text-xs text-gray-500 font-normal">
                <p>{count} ACCOUNTS</p>
                <AvatarGroup max={3}>
                  <Avatar
                    alt="Remy Sharp"
                    src={Avatar2}
                    sx={{ width: 15, height: 15 }}
                  />
                  <Avatar
                    alt="Travis Howard"
                    src={Avatar3}
                    sx={{ width: 15, height: 15 }}
                  />
                  <Avatar
                    alt="Cindy Baker"
                    src={Avatar1}
                    sx={{ width: 15, height: 15 }}
                  />
                </AvatarGroup>
              </span>
              <h4 className="text-md font-semibold capitalize my-2">
                {role === "org_admin" ? "Organization Admin" : role}
              </h4>
              <p className="text-[13px]">
                A role provides access to predefined menus and features so that
                depending on the assigned roles.
              </p>
            </span>
          ))
        ) : (
          <span className="border border-gray-100 py-2 px-3 rounded-md shadow-sm text-center">
            {" "}
            No Roles Found!
          </span>
        )}
      </div>
    </div>
  );
};

export default RoleCount;
