import React from "react";
import FileSharing from "../assets/fileSharing.svg";
import TotalUsers from "../assets/totalUsers.svg";
import OrganizationStorage from "../assets/organization_storage.svg";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import GeographicalMap from "../components/GeographicalMap";
import FileTypeDoughnut from "../components/FileTypeDoughnut";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 5,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#FF7A00" : "#308fe8",
  },
}));

const Analytics = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-md shadow-lg">
          <span className="flex flex-row gap-1">
            <img
              src={FileSharing}
              alt="."
              className="bg-[#EBEEFB] p-1 rounded-full"
            />
            <h5 className="text-sm font-semibold">File Sharing</h5>
          </span>
          <hr className="my-3 border border-[#F6F6F6]" />

          <span>
            <h3 className="text-xl font-semibold">1250</h3>
            <span className="flex flex-row gap-1">
              <p className="text-sm text-[#0E8B3C]">+ 25%</p>
              <p className="text-sm text-gray-400">from last month</p>
            </span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-md shadow-lg">
          <span className="flex flex-row gap-1">
            <img
              src={TotalUsers}
              alt="."
              className="bg-[#F7E9ED] p-1 rounded-full"
            />
            <h5 className="text-sm font-semibold">Total Users</h5>
          </span>
          <hr className="my-3 border border-[#F6F6F6]" />

          <span>
            <h3 className="text-xl font-semibold">800</h3>
            <span className="flex flex-row gap-1">
              <p className="text-sm text-[#C52222]">- 8%</p>
              <p className="text-sm text-gray-400">from last month</p>
            </span>
          </span>
        </div>
        <div className="bg-white p-4 rounded-md shadow-lg">
          <span className="flex flex-row gap-1">
            <img src={OrganizationStorage} alt="." />
            <h5 className="text-sm font-semibold">Organization Storage</h5>
          </span>
          <hr className="my-3 border border-[#F6F6F6]" />

          <span>
            <h3 className="text-xl font-semibold">500 TB</h3>
            <span className="">
              <BorderLinearProgress
                className="w-3/4 my-2"
                variant="determinate"
                value={80}
              />
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 my-4">
        <span className="shadow-lg border border-gray-100 rounded-md py-6">
          <FileTypeDoughnut />
        </span>

        <span className="col-span-2 ">
          <GeographicalMap />
        </span>
      </div>
    </div>
  );
};

export default Analytics;
