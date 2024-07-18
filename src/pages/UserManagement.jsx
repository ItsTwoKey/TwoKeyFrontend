import React, { useState } from "react";
import RoleCount from "../components/RoleCount";
import UserManagementTable from "../components/UserManagementTable";
import { supabase } from "../helper/supabaseClient";
import DownloadCloud from "../assets/downloadCloud.svg";
import { UserState } from "../context/UserContext";
import { api } from "../utils/axios-instance";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const downloadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/list_users");
      if (res.status !== 200) {
        throw new Error(res.data || "Something went wrong");
      }
      const listUsers = res.data?.map((user) => {
        let { metadata, dept, profilePictureUrl, id, org, ...rest } = user;
        return rest;
      });
      const allKeys = [...new Set(listUsers.flatMap(Object.keys))];

      const csvRows = [];
      csvRows.push(allKeys.join(",").toUpperCase());
      console.log({ listUsers, allKeys, csvRows });
      listUsers.forEach((row) => {
        const values = allKeys.map((key) => {
          const escapeValue = (
            row[key] !== undefined ? "" + row[key] : ""
          ).replace(/"/g, '\\"');
          return `"${escapeValue}"`;
        });
        csvRows.push(values.join(","));
      });
      const csvContent = csvRows.join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "user_info.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setError(error?.message || "Something went wrong. Please try again!");

      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };
  if (error) {
    toast.error(error);
    setError("");
  }

  return (
    <UserState>
      <div className="p-4">
        <RoleCount />

        <div className="p-3 border rounded-md ">
          <div className="sm:flex w-full  flex-shrink-0  justify-between pr-2 items-center my-2">
            <span className="">
              <h2 className="text-lg font-semibold">Administrator Accounts</h2>
              <p className="text-sm">
                Find all of your company's administrator accounts and their
                associated roles.
              </p>
            </span>
            <button
              onClick={downloadData}
              className="border border-gray-300 px-4 py-1.5 text-sm rounded-md  flex items-center gap-2 hover:border-blue-300  duration-200"
            >
              <img src={DownloadCloud} alt="" />
              {loading ? "processing..." : "Export"}
            </button>
          </div>

          <UserManagementTable />
        </div>
      </div>
    </UserState>
  );
};

export default UserManagement;
