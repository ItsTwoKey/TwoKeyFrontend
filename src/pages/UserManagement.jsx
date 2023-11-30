import React from "react";
import RoleCount from "../components/RoleCount";
import UserManagementTable from "../components/UserManagementTable";

const UserManagement = () => {
  return (
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

          <button className="border border-gray-300 px-4 py-1 text-sm rounded-md mx-2">
            Export
          </button>
        </div>

        <UserManagementTable />
      </div>
    </div>
  );
};

export default UserManagement;
