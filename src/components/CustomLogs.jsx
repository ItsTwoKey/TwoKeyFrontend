import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useDarkMode } from "../context/darkModeContext";
import Skeleton from "@mui/material/Skeleton";

const CustomLogs = ({ logs }) => {
  const { darkMode } = useDarkMode();

  const formatTimestamp = (timestamp) => {
    const options = {
      timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return new Date(timestamp).toLocaleString("en-IN", options);
  };

  const skeletons = [];
  for (let i = 0; i < 4; i++) {
    skeletons.push(
      <div key={i} className="p-3 border-b rounded-lg flex items-center gap-2">
        <Skeleton
          key={i}
          variant="circular"
          width={24}
          height={24}
          className="mr-2"
        />

        <span className="w-full">
          <Skeleton className="w-3/5" height={20} />
          <Skeleton className="w-2/5" height={20} />
        </span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Paper elevation={0} className="h-72 ">
        <div className="h-60 overflow-y-scroll scrollbar-hide">
          {logs && logs.length ? (
            logs?.map((log, index) => (
              <div key={index} className="border-b">
                <span className="flex flex-row gap-2 p-2">
                  <Tooltip title={log.user} arrow>
                    <Avatar
                      src={log.profile_pic}
                      alt="owner pic"
                      sx={{ width: 25, height: 25 }}
                    />
                  </Tooltip>
                  <span>
                    <p className="text-sm">
                      <span className="font-semibold">{log.username}</span>{" "}
                      {log.event === "screenshot"
                        ? "took Screenshot of"
                        : log.event === "download"
                        ? "downloaded"
                        : "accessed"}
                      <span className="font-semibold"> {log.file_name}</span>{" "}
                      file.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {formatTimestamp(log.timestamp)}
                    </p>
                  </span>
                </span>
              </div>
            ))
          ) : (
            <div className="h-56 overflow-y-scroll scrollbar-hide flex items-center justify-center">
              <p className="text-lg font-semibold">No logs to show!</p>
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default CustomLogs;
