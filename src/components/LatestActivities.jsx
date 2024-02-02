import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useDarkMode } from "../context/darkModeContext";
import { useLocation } from "react-router-dom";
import { supabase } from "../helper/supabaseClient";
import secureLocalStorage from "react-secure-storage";

import Skeleton from "@mui/material/Skeleton";

const LatestActivities = () => {
  const { darkMode } = useDarkMode();
  const [selectedValue, setSelectedValue] = useState("all");
  const [logs, setLogs] = useState([]);
  const location = useLocation();
  const isUserProfile = location.pathname.includes("/profile");

  //   realtime supabase subscribe
  useEffect(() => {
    const channel = supabase
      .channel("custom_all_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "access_log" },
        () => {
          // console.log("Change received!", payload);

          getCommonLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ...............

  useEffect(() => {
    getCommonLogs();
  }, []);

  const getCommonLogs = async () => {
    try {
      const cacheKey = isUserProfile ? "userLogs" : "commonLogs";

      const cachedLogs = secureLocalStorage.getItem(cacheKey);

      if (cachedLogs) {
        // console.log("Using cached logs:", JSON.parse(cachedLogs));
        setLogs(JSON.parse(cachedLogs));
      }

      let token = JSON.parse(secureLocalStorage.getItem("token"));

      const logsEndpoint = isUserProfile
        ? `${process.env.REACT_APP_BACKEND_BASE_URL}/file/getLogs?global=0&recs=5`
        : `${process.env.REACT_APP_BACKEND_BASE_URL}/file/getLogs/?recs=10`;

      const accessLogs = await axios.get(logsEndpoint, {
        headers: {
          Authorization: `Bearer ${token.session.access_token}`,
        },
      });

      // console.log("Common logs", accessLogs.data);

      secureLocalStorage.setItem(cacheKey, JSON.stringify(accessLogs.data));

      setLogs(accessLogs.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return new Date(timestamp).toLocaleString("en-IN", options);
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    console.log("Selected Value:", value);
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
    <div className={`${isUserProfile ? "w-full" : "w-full md:w-2/5"}`}>
      <Paper elevation={isUserProfile ? 0 : 1} className="h-72 ">
        <div
          className={`flex justify-between items-center p-4 ${
            darkMode ? "bg-gray-600 text-gray-200" : " "
          }`}
        >
          <span className="flex flex-row items-center gap-1">
            <p className="text-sm font-semibold">Latest Activities</p>
            <select
              className="text-sm text-gray-400"
              onChange={handleSelectChange}
              value={selectedValue}
              style={{ outline: "none" }}
            >
              <option value="all">All</option>
              <option value="file_access">Access</option>
              <option value="screenshot">Screenshot</option>
              <option value="download">Download</option>
            </select>
          </span>
        </div>

        <div className="h-56 overflow-y-scroll scrollbar-hide">
          {logs.length ? (
            logs
              .filter((log) => {
                if (selectedValue === "all") {
                  return true;
                } else {
                  return log.event === selectedValue;
                }
              })
              .map((log, index) => (
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
                          : "accessed"}{" "}
                        <span className="font-semibold">
                          {log.file_name.split("_TS=")[0]}
                        </span>{" "}
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
            <div className="h-56 overflow-y-scroll scrollbar-hide">
              {skeletons}
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default LatestActivities;
