import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import axios from "axios";
import ProfilePicDummy from "../assets/profilePicDummy.jpg";

const SecurityAllocation = ({
  handleSecurityAllocation,
  isOpen,
  checkboxValues,
}) => {
  const { listLocations } = useAuth();
  const [formData, setFormData] = useState({});
  const [currentTime, setCurrentTime] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const { coordinates } = useAuth();

  const sendDataToCallback = () => {
    // Validate form data or perform any other necessary logic before sending it
    const selectedUserIds = selectedUsers.map((user) => user.id);
    handleSecurityAllocation({ ...formData, selectedUsers: selectedUserIds });
  };

  useEffect(() => {
    // Fetch user data only when the component mounts or isOpen changes
    if (isOpen) {
      listLocations();
      listUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    // Fetch user data whenever formData or selectedUsers changes
    if (isOpen) {
      sendDataToCallback();
    }
  }, [formData, selectedUsers]);

  useEffect(() => {
    // Set the initial current time when the component mounts
    const now = new Date();
    setCurrentTime(
      `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
  }, [selectedUsers]);

  const listUsers = async () => {
    let token = JSON.parse(sessionStorage.getItem("token"));
    try {
      const userList = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/list_users/`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      console.log("users :", userList.data);
      setUsers(userList.data);
    } catch (error) {
      console.log(error);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const calculateTimeDifference = (selectedDate, selectedTime) => {
    if (!selectedDate || !selectedTime) {
      // Set a default time difference or handle as needed
      return null;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const currentTime = new Date();

    if (selectedDateTime < currentTime) {
      // Handle invalid time
      return null;
    }

    const timeDiffInSeconds = Math.floor(
      (selectedDateTime - currentTime) / 1000
    );
    return timeDiffInSeconds;
  };

  const handleFormdataChange = (e) => {
    const { name, value } = e.target;
    let timeDifference;

    if (name === "selectedDate") {
      // Format date consistently before updating formData
      const formattedDate = new Date(value).toISOString().split("T")[0];
      timeDifference = calculateTimeDifference(
        formattedDate,
        formData.selectedTime
      );
    } else if (name === "selectedTime") {
      timeDifference = calculateTimeDifference(formData.selectedDate, value);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      timeDifference: timeDifference,
    }));
  };

  return (
    <div>
      <div className="">
        {checkboxValues.geoLocation && (
          <div>
            <p className="text-sm my-2 font-semibold">Location</p>

            <Select
              name="location"
              value={formData?.location || ""}
              onChange={(e) => handleFormdataChange(e)}
              displayEmpty
              size="small"
              fullWidth
              className="bg-white"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {coordinates.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.properties.name}
                </MenuItem>
              ))}
            </Select>
          </div>
        )}

        {checkboxValues.accessControl && (
          <div>
            <p className="text-sm my-2 font-semibold">
              How do you share your file
            </p>
            <span className="flex justify-between my-4">
              <input
                type="date"
                value={today}
                disabled
                className="px-2 py-1 border-2 rounded-md bg-indigo-100 text-xs font-semibold text-gray-600 w-32"
              />
              <p>›</p>
              <input
                type="date"
                name="selectedDate"
                value={formData?.selectedDate || ""}
                min={today} // Set the minimum date to today
                onChange={(e) => handleFormdataChange(e)}
                className={`px-2 py-1 border-2 rounded-md ${
                  formData?.selectedDate ? "bg-indigo-100" : "bg-white"
                } text-xs font-semibold text-gray-600 w-32`}
              />
            </span>

            <span className="flex justify-between my-4">
              <input
                type="time"
                name="selectedTime"
                disabled
                value={currentTime}
                className="px-2 py-1 border-2 rounded-md bg-indigo-100 text-xs font-semibold text-gray-600 w-32"
              />
              <p>›</p>
              <input
                type="time"
                name="selectedTime"
                value={formData?.selectedTime || ""}
                onChange={(e) => handleFormdataChange(e)}
                className={`px-2 py-1 border-2 rounded-md ${
                  formData?.selectedTime ? "bg-indigo-100" : "bg-white"
                } text-xs font-semibold text-gray-600 w-32`}
              />
            </span>
          </div>
        )}

        <div className="my-2">
          <p className="text-gray-600 font-semibold my-1">Receiver</p>
          <Select
            multiple
            value={selectedUsers.map((user) => user.id)}
            onChange={(event) => {
              const selectedUserIds = event.target.value;
              const selectedUserObjects = users.filter((user) =>
                selectedUserIds.includes(user.id)
              );
              setSelectedUsers(selectedUserObjects);
            }}
            displayEmpty
            size="small"
            fullWidth
            renderValue={(selected) => (
              <div>
                {selected.map((userId) => {
                  const { name, last_name, profile_pic } = users.find(
                    (user) => user.id === userId
                  );
                  return (
                    <Chip
                      key={userId}
                      avatar={
                        <img
                          src={profile_pic}
                          alt={`${name}'s Profile Pic`}
                          style={{
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                          }}
                        />
                      }
                      label={
                        <div className="flex gap-1">{`${name} ${last_name}`}</div>
                      }
                      className="mx-1"
                    />
                  );
                })}
              </div>
            )}
          >
            <MenuItem value="" disabled>
              <p>Select a user</p>
            </MenuItem>
            {users.length > 0 &&
              users.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                  style={{
                    borderRadius: "10px",
                  }}
                >
                  <span className="flex justify-between items-center w-full">
                    <span className="flex flex-row items-center gap-2">
                      <img
                        src={
                          user.profile_pic ? user.profile_pic : ProfilePicDummy
                        }
                        alt="Profile pic"
                        className="h-8 w-8 rounded-full"
                      />
                      <span>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs font-light text-gray-500">
                          {user.email}
                        </p>
                      </span>
                    </span>
                    <p className="text-sm font-semibold">Invite › </p>
                  </span>
                </MenuItem>
              ))}
          </Select>

          {selectedUsers.map((user, index) => (
            <div
              key={index}
              className="flex justify-between my-2 bg-[#EDEDFC] p-2"
            >
              <p className="text-sm font-medium text-indigo-700">
                {user.name} {user.last_name}
              </p>

              <span className="flex flex-row gap-4 items-center">
                <img
                  src={user.profile_pic ? user.profile_pic : ProfilePicDummy}
                  alt="Profile pic"
                  className="h-6 w-6 rounded-md"
                />
                <p className="text-xs font-medium text-green-900 bg-green-100 p-1 rounded-md">
                  Can Edit
                </p>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityAllocation;
