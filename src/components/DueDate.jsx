import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

const currentDateTime = () => {
  //  calculate time and date for imput field
  const time =
    new Date().toISOString().slice(0, 11) +
    new Date().toTimeString().slice(0, 5);
  return time;
};

const rescheduleDate = (date) => {
  // calculate new rescheduled timing
  return parseInt((new Date(date).getTime() - new Date().getTime()) / 1000);
};

const DueDate = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDue, setSelectedDue] = useState(null);
  const [extendedDate, setExtendedDate] = useState(currentDateTime());
  const [reschedule, setReshedule] = useState(false);
  const [newExpiry, setnewExpiry] = useState(rescheduleDate(currentDateTime()));
  const [timeInterval, setTimeInterval] = useState(null);

  let role = JSON.parse(localStorage.getItem("profileData"));
  const isOrgAdmin = role && role.role_priv === "org_admin";

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

  const handleExtendedDate = (e) => {
    setExtendedDate(e.target.value);
    setnewExpiry(rescheduleDate(e.target.value));
  };
  const updateDueDate = async (Id) => {
    let token = JSON.parse(sessionStorage.getItem("token"));
    // get time difference in seconds
    setnewExpiry(rescheduleDate(extendedDate));
    let body = {
      expiration_time: newExpiry,
      last_updated: new Date().toJSON(),
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
      toggleReshedule();

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

  const toggleReshedule = () => {
    reschedule ? setReshedule(false) : setReshedule(true);
    console.log(reschedule);
  };

  return (
    <div className="w-full md:w-3/5">
      <Paper className="h-72 ">
        <div className="flex justify-between items-center p-4">
          <p className="text-sm font-medium">Due Date</p>
        </div>
        <div className="px-4 h-56 overflow-y-scroll scrollbar-hide">
          {!loading ? (
            dues.length ? (
              dues?.map((due, index) => (
                <div
                  key={index}
                  className="border shadow p-3 my-2 rounded-lg flex flex-col "
                  onClick={() => {
                    if (isOrgAdmin) {
                      setSelectedDue(due);
                    } else {
                      console.log(
                        "You are not authorised to reschedule due dates"
                      );
                    }
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
                      is end in {convertSecondsToDaysHours(due.expiration_time)}
                      .
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
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between px-5 py-3 my-2">
                        <button
                          onClick={() => {
                            toggleReshedule(true);
                            setnewExpiry(selectedDue.last_updated);
                          }}
                          className={`text-[white] rounded-lg cursor-pointer py-2 px-4 text-sm bg-[#5E5ADB] ${
                            reschedule ? "hidden" : ""
                          }`}
                        >
                          {/* previous color #E79800 */}
                          Re-schedule
                        </button>
                      </div>
                      <div
                        className={`flex flex-col justify-center ${
                          reschedule ? "" : "hidden"
                        }`}
                      >
                        <label
                          htmlFor="extendDate"
                          className="font-bold py-1 px-4"
                        >
                          Select New Schedule :{" "}
                        </label>
                        <div className="flex justify-left gap-3 px-5 py-3 my-2">
                          <input
                            className="bg-[#F1F1FF] py-1 px-4 rounded-lg"
                            type="datetime-local"
                            value={extendedDate}
                            onChange={handleExtendedDate}
                            name="extendDate"
                            id="extendDate"
                            min={currentDateTime()}
                          />
                          <span className="bg-[#F1F1FF] flex gap-1 items-center w-auto px-4 py-1 rounded-lg">
                            <strong>Ends in : </strong>
                            <p className="text-sm">
                              {convertSecondsToDaysHours(newExpiry)}
                            </p>
                          </span>
                        </div>
                        <div className="flex justify-end gap-3 items-center px-6 py-2">
                          <button
                            onClick={() => toggleReshedule(false)}
                            className="text-[white] rounded-lg  cursor-pointer py-2 px-4  text-sm bg-[#5E5ADB]"
                          >
                            Close
                          </button>
                          <button
                            onClick={() => updateDueDate(selectedDue.file)}
                            className="text-[white] rounded-lg py-2 cursor-pointer px-4 text-sm bg-[#5E5ADB]"
                          >
                            Confirm
                          </button>
                        </div>
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
