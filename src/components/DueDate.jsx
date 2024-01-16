import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

const DueDate = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDue, setSelectedDue] = useState(null);

  useEffect(() => {
    const fetchDueDates = async () => {
      try {
        const cacheKey = "dueDatesCache";

        // Check if due dates data is available in localStorage
        const cachedDueDates = localStorage.getItem(cacheKey);

        if (cachedDueDates) {
          console.log("Using cached due dates:", JSON.parse(cachedDueDates));
          setDues(JSON.parse(cachedDueDates));
          setLoading(false);
        }

        let token = JSON.parse(sessionStorage.getItem("token"));

        const dueDates = await axios.get(
          "https://twokeybackend.onrender.com/file/getLogs/dues/",
          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );

        console.log("Due dates", dueDates.data);

        if (dueDates.data) {
          // Replace the cached due dates data with the new data
          localStorage.setItem(cacheKey, JSON.stringify(dueDates.data));

          // Update the state with the new data
          setDues(dueDates.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching due dates:", error);
        setLoading(false);
      }
    };

    fetchDueDates();
  }, []);

  const updateDueDate = async (Id) => {
    let token = JSON.parse(sessionStorage.getItem("token"));
    let body = {
      expiration_time: 172800,
    };
    try {
      const res = await axios.put(
        `https://twokeybackend.onrender.com/file/editShare/${Id}/`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      console.log("updated Due Date:", res);

      // console.log("id:", Id);
    } catch (error) {
      console.log(error);
    }
  };

  const skeletons = Array.from({ length: 4 }, (_, i) => (
    <div
      key={i}
      className="border shadow p-3 my-2 rounded-lg flex items-center gap-2"
    >
      <Skeleton
        key={i}
        variant="rounded"
        width={24}
        height={24}
        className="mr-2"
      />
      <Skeleton className="w-1/5" height={28} />
      <Skeleton className="w-1/5" height={25} />
      <Skeleton className="w-2/5" height={28} />
    </div>
  ));

  const convertSecondsToDaysHours = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);

    let result = "";
    if (days > 0) {
      result += `${days} ${days === 1 ? "day" : "days"}`;
    }

    if (hours > 0) {
      result += ` ${hours} ${hours === 1 ? "hour" : "hours"}`;
    }

    return result.trim();
  };

  function convertDateFormat(originalDateString) {
    // Parse the original date string
    const originalDate = new Date(originalDateString);

    // Extract day, month, and year
    const day = originalDate.getUTCDate();
    const month = originalDate.getUTCMonth() + 1; // Months are zero-based
    const year = originalDate.getUTCFullYear();

    // Format the date components with leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Assemble the formatted date string
    const formattedDateString = `${formattedDay} / ${formattedMonth} / ${year}`;

    return formattedDateString;
  }

  return (
    <div className="w-full md:w-3/5">
      <Paper className="h-72 ">
        <div className="flex justify-between items-center p-4">
          <p className="text-sm font-semibold">Due Date</p>
        </div>
        <div className="px-4 h-56 overflow-y-scroll scrollbar-hide">
          {!loading ? (
            dues.length ? (
              dues?.map((due, index) => (
                <div
                  key={index}
                  className="border shadow p-3 my-2 rounded-lg flex flex-col "
                  onClick={() => {
                    // Set the selectedDue state when a due is clicked
                    setSelectedDue(due);
                    // Log the details to the console
                    console.log("Selected Due:", due);
                  }}
                >
                  <div className="flex flex-row">
                    <Tooltip
                      title={due.shared_with[0].user_email}
                      arrow
                      className="mr-2"
                    >
                      <Avatar
                        src={due.shared_with[0].profile_pic}
                        alt="owner pic"
                        sx={{ width: 25, height: 25 }}
                        variant="rounded"
                      />
                    </Tooltip>
                    <p>
                      <strong className="font-semibold">
                        {due.shared_with[0].first_name}{" "}
                        {due.shared_with[0].last_name}
                      </strong>
                      's access to{" "}
                      <strong className="font-semibold">
                        {due.file_name.split("_TS=")[0]}
                      </strong>{" "}
                      ends in {convertSecondsToDaysHours(due.expiration_time)}.
                    </p>
                  </div>

                  {selectedDue && selectedDue.file_name === due.file_name && (
                    <div className="px-3 py-1 ">
                      <p className="text-sm font-bold">File Due Date</p>
                      <div className="border border-gray-200 rounded-lg w-full py-1 px-3 my-2 shadow">
                        <p className="text-sm font-semibold">
                          File access will restricted to receiver:
                        </p>
                        <span className="flex flex-row items-center gap-1 ml-4">
                          <span className="border-2 border-gray-200 rounded-full h-6 my-auto"></span>
                          <span className="bg-[#F1F1FF] w-full rounded-sm flex justify-between px-2 py-1 my-2">
                            <p className="text-sm">
                              {convertDateFormat(selectedDue.last_updated)}
                            </p>
                            <button
                              onClick={() => updateDueDate(selectedDue.file)}
                              className="text-[#E79800] underline text-sm"
                            >
                              Re-schedule
                            </button>
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center">No due dates!</div>
            )
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

export default DueDate;
