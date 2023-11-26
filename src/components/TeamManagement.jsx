import React, { useState, useEffect } from "react";
import axios from "axios";
import InviteMember from "./InviteMember";
import RevokeInvite from "./RevokeInvite";
import ResendInvite from "./ResendInvite";
import TeamManagementTable from "./TeamManagementTable";
import { supabase } from "../helper/supabaseClient";

const TeamManagement = () => {
  const [data, setData] = useState([]);

  const downloadData = async () => {
    try {
      let { data: user_info, error } = await supabase
        .from("user_info")
        .select("*");

      if (error) {
        throw error;
      }

      // Convert the data to CSV format
      const csvContent =
        "data:text/csv;charset=utf-8," +
        Object.keys(user_info[0]).join(",") +
        "\n" +
        user_info.map((row) => Object.values(row).join(",")).join("\n");

      // Create a CSV file and trigger download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "user_info.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // const [roles, setRoles] = useState([]);
  // useEffect(() => {
  //   const getRoles = async () => {
  //     try {
  //       let token = JSON.parse(sessionStorage.getItem("token"));
  //       const role = await axios.get(
  //         "https://twokeybackend.onrender.com/role/listRoles/",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token.session.access_token}`,
  //           },
  //         }
  //       );
  //       console.log("roles:", role.data);
  //       setRoles(role.data);
  //     } catch (error) {
  //       console.log("Error fetching departments");
  //     }
  //   };

  //   getRoles();
  // }, []);

  return (
    <div className="py-4 px-8 rounded-md">
      <h2 className="text-xl font-semibold p-2">Team Management</h2>
      <hr className="border border-white border-b-[#D8DEE4]" />

      <div className="my-4 rounded-lg p-4 bg-[#F1F1FF] w-full">
        <p className="font-semibold mb-1">Members</p>
        <div className="flex flex-row justify-between items-center">
          <p className="w-1/2 text-sm">
            Invite a team member on Epitaxial IT to work faster and collaborate
            easily together. Manage their permissions to better structure
            projects.
          </p>
          <span className="flex flex-row gap-2 text-sm">
            <button
              onClick={downloadData}
              className="bg-white border-2 rounded-lg py-1 px-2"
            >
              Download CSV
            </button>
            {/* <button className="bg-[#5E5ADB] text-white rounded-lg py-1 px-2">
              Invite a member
            </button> */}
            <InviteMember />
          </span>
        </div>
      </div>

      {/* <div>
        {users.map((user) => (
          <p key={user.id}>{user.name}</p>
        ))}
      </div> */}
      <TeamManagementTable />
    </div>
  );
};

export default TeamManagement;
