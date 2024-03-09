import React from "react";
import RecentFiles from "../components/RecentFiles";
import { useDarkMode } from "../context/darkModeContext";
import { Dialog } from "@mui/material";
import FileViewer from "../components/FileViewer";
import { useAuth } from "../context/authContext";
import DueDate from "../components/DueDate";
import DashboardTabs from "../components/DashboardTabs";
import LatestActivities from "../components/LatestActivities";
import secureLocalStorage from "react-secure-storage";
import ErrorPage from "../components/ErrorPage";

const Dashboard = () => {
  const { darkMode } = useDarkMode();
  const { isFileViewerOpen, closeFileViewer } = useAuth();
  if (!secureLocalStorage.getItem("token")) {
    return <ErrorPage error="You are not authorised" />;
  }
  return (
    <div
      className={`w-full p-4 h-full overflow-clip ${
        darkMode ? "bg-gray-800 text-white" : "text-gray-800"
      }`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <DueDate />
        <LatestActivities />
      </div>
      <div>
        {/* <RecentFiles /> */}
        {/* <DashboardFiles /> */}
        <DashboardTabs />
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
