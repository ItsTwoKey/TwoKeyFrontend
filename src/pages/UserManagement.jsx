import React from "react";
import RoleCount from "../components/RoleCount";
import UserManagementTable from "../components/UserManagementTable";
import { supabase } from "../helper/supabaseClient";
import DownloadCloud from "../assets/downloadCloud.svg";
import { UserState } from "../components/userManagement/context/UserContext.js";

const UserManagement = () => {
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

  return (
    <UserState>
      <div className="p-4">
        <RoleCount />

        <div className="p-3 border rounded-md ">
          <div className="flex flex-row justify-between items-center my-2">
            <span>
              <h2 className="text-lg font-semibold">Administrator Accounts</h2>
              <p className="text-sm">
                Find all of your company's administrator accounts and their
                associated roles.
              </p>
            </span>
            <button
              onClick={downloadData}
              className="border border-gray-300 px-4 py-1.5 text-sm rounded-md mx-2 flex items-center gap-2"
            >
              <img src={DownloadCloud} alt="" />
              Export
            </button>
          </div>

          <UserManagementTable />
        </div>
      </div>
    </UserState>
  );
};

export default UserManagement;
