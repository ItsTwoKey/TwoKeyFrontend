import React, { useState } from "react";
import InviteOptions from "../components/teamManagement/InviteOptions";

import TeamManagementTable from "./TeamManagementTable";
import PendingInviteTable from "./PendingInviteTable";
import toast from "react-hot-toast";
import { api } from "../utils/axios-instance";

const TeamManagement = () => {
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
    <div className="py-4 px-8 rounded-md h-screen overflow-y-scroll scrollbar-hide">
      <h2 className="text-xl font-semibold p-2">Team Management</h2>
      <hr className="border border-white border-b-[#D8DEE4]" />

      <div className="my-4 rounded-lg p-4 bg-[#F1F1FF] w-full shadow-lg">
        <p className="font-semibold mb-1">Members</p>
        <div className="lg:flex flex-row justify-start items-center space-y-4 lg:space-y-0">
          <p className="w-full  lg:w-1/2  text-sm">
            Invite a team member on Epitaxial IT to work faster and collaborate
            easily together. Manage their permissions to better structure
            projects.
          </p>
          <span className="flex flex-row gap-2 text-sm">
            <button
              onClick={downloadData}
              className="bg-white border-2 rounded-lg py-1 px-2"
            >
              {loading ? "Processing..." : "Download CSV"}
            </button>

            <InviteOptions />
          </span>
        </div>
      </div>

      <TeamManagementTable />

      <div className="my-4 rounded-lg p-4 bg-[#F1F1FF] w-full shadow-lg">
        <p className="font-semibold mb-1">Pending Invites</p>

        <p className="text-sm w-11/12">
          In an invitation you sent has expired or been lost, you can resend it.
          You can also revoke an invitation to prevent a member who recived an
          invitation from accepting it.
        </p>
      </div>
      <PendingInviteTable />
    </div>
  );
};

export default TeamManagement;
