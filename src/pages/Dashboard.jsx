import React from "react";
import QuickShare from "../components/QuickShare";
import RecentFiles from "../components/RecentFiles";
import { useDarkMode } from "../context/darkModeContext";
import { Dialog } from "@mui/material";
import FileViewer from "../components/FileViewer";
import { useAuth } from "../context/authContext";
import DueDate from "../components/DueDate";
import AccountFiles from "../components/AccountFiles";
import LatestActivities from "../components/LatestActivities";

import ErrorPage from "../components/ErrorPage";

let folders = [
  "Account",
  "Finance",
  "Development",
  "Manufacturing",
  "Sales",
  "Human Resources",
];

const Dashboard = () => {
  const { darkMode } = useDarkMode();
  const { isFileViewerOpen, closeFileViewer, screenshotDetected } = useAuth();
  if (!sessionStorage.getItem("token")) {
    return <ErrorPage error="You are not authorised" />;
  }
  return (
    <div
      className={`w-full p-4 h-full ${
        darkMode ? "bg-gray-800 text-white" : "text-gray-800"
      }`}
    >
      <div className="flex flex-row gap-4">
        <DueDate />
        <LatestActivities />
      </div>
      <div>
        <RecentFiles />
        <AccountFiles />
      </div>
      {/* <div className={`${screenshotDetected ? "blur" : ""}`}> */}
      <Dialog open={isFileViewerOpen} onClose={closeFileViewer} maxWidth="lg">
        <FileViewer onClose={closeFileViewer} />{" "}
      </Dialog>
      {/* </div> */}
    </div>
  );
};

export default Dashboard;
