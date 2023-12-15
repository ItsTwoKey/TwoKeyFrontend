import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ProfilePicDummy from "../assets/profilePicDummy.jpg";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderLeft: 0,
    borderRight: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const CustomExpandSymbol = ({ expanded }) => (
  <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
    {expanded ? "›" : "›"}
  </div>
);

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<CustomExpandSymbol />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#EDEDFC" : "#EDEDFC",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid inherit",
  backgroundColor: "#F7F9FC",
}));

const SecurityAllocation = ({
  handleSecurityAllocation,
  selectedUsers,
  checkboxValues,
}) => {
  const [inputData, setInputData] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentTime, setCurrentTime] = useState("");
  const { coordinates } = useAuth();

  const handleFormdataChange = (event, index) => {
    const { name, value } = event.target;

    // Additional logic to validate the time input
    if (name === "selectedTime") {
      const selectedTime = new Date(today + "T" + value);
      const currentTime = new Date();

      if (selectedTime < currentTime) {
        // Show an error message or handle invalid time here
        return;
      }
    }

    setFormData({
      ...formData,
      [index]: {
        ...formData[index],
        [name]: value,
      },
    });
  };

  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : null);
  };

  //   useEffect(() => {
  //     handleSecurityAllocation(inputData);
  //     // Update the current time every second
  //     const intervalId = setInterval(() => {
  //       const now = new Date();
  //       setCurrentTime(
  //         `${now.getHours().toString().padStart(2, "0")}:${now
  //           .getMinutes()
  //           .toString()
  //           .padStart(2, "0")}`
  //       );
  //     }, 1000);

  //     return () => clearInterval(intervalId);
  //   }, [handleSecurityAllocation, inputData]);

  useEffect(() => {
    // Set the initial current time when the component mounts
    const now = new Date();
    setCurrentTime(
      `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
  }, []);

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  //   useEffect(() => {
  //     const handleConsoleUserData = () => {
  //       const userTimeData = selectedUsers.map((user, index) => {
  //         const location = formData[index]?.location;
  //         const timePeriod = formData[index]?.timePeriod;
  //         if (timePeriod === "certainPeriod") {
  //           const selectedDateTime = new Date(
  //             `${formData[index]?.selectedDate}T${formData[index]?.selectedTime}`
  //           );
  //           const currentTime = new Date();

  //           if (selectedDateTime < currentTime) {
  //             // Handle invalid time
  //             return null;
  //           }

  //           const timeDiff = selectedDateTime - currentTime;
  //           const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  //           const minutes = Math.floor(
  //             (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
  //           );

  //           return {
  //             user: user.id,
  //             location,
  //             timePeriod,
  //             timeDifference: `${hours} hours ${minutes} minutes`,
  //           };
  //         } else if (timePeriod === "permanently") {
  //           return {
  //             user: user.id,
  //             location,
  //             timePeriod,
  //             timeDifference: "Permanently",
  //           };
  //         }

  //         return null;
  //       });

  //       //   console.log(userTimeData);
  //       handleSecurityAllocation(userTimeData);
  //     };

  //     handleConsoleUserData();
  //   }, [formData, selectedUsers]);

  useEffect(() => {
    const handleConsoleUserData = () => {
      const userTimeData = selectedUsers.map((user, index) => {
        const location = formData[index]?.location;

        const selectedDateTime = new Date(
          `${formData[index]?.selectedDate}T${formData[index]?.selectedTime}`
        );
        const currentTime = new Date();

        if (selectedDateTime < currentTime) {
          // Handle invalid time
          return null;
        }

        const timeDiffInSeconds = Math.floor(
          (selectedDateTime - currentTime) / 1000
        ); // Convert milliseconds to seconds

        return {
          user: user.id,
          location,
          timeDifference: `${timeDiffInSeconds}`,
        };
      });

      console.log(userTimeData);
      handleSecurityAllocation(userTimeData);
      console.log("at security", coordinates);
    };

    handleConsoleUserData();
  }, [formData, selectedUsers]);

  const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD" format

  return (
    <div>
      <div className="">
        {selectedUsers.map((user, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleAccordionChange(`panel${index}`)}
            className="my-1"
          >
            <AccordionSummary
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{ display: "flex", justifyContent: "flex-between" }}
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
            </AccordionSummary>
            <AccordionDetails className="bg-gray-100">
              {checkboxValues.geoLocation && (
                <div>
                  <p className="text-sm my-2 font-semibold">Location</p>

                  <Select
                    name="location"
                    value={formData[index]?.location || ""}
                    onChange={(e) => handleFormdataChange(e, index)}
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
                      className="px-2 py-1 border-2 rounded-md bg-white text-xs font-semibold text-gray-600 w-32"
                    />
                    <p>›</p>
                    <input
                      type="date"
                      name="selectedDate"
                      value={formData[index]?.selectedDate || ""}
                      min={today} // Set the minimum date to today
                      onChange={(e) => handleFormdataChange(e, index)}
                      className="px-2 py-1 border-2 rounded-md bg-white text-xs font-semibold text-gray-600 w-32"
                    />
                  </span>

                  <span className="flex justify-between my-4">
                    <input
                      type="time"
                      name="selectedTime"
                      disabled
                      value={currentTime}
                      className="px-2 py-1 border-2 rounded-md bg-white text-xs font-semibold text-gray-600 w-32"
                    />
                    <p>›</p>
                    <input
                      type="time"
                      name="selectedTime"
                      value={formData[index]?.selectedTime || ""}
                      onChange={(e) => handleFormdataChange(e, index)}
                      className="px-2 py-1 border-2 rounded-md bg-white text-xs font-semibold text-gray-600 w-32"
                    />
                  </span>
                </div>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      {/* <button onClick={handleConsoleUserData}>Console User Data</button> */}
    </div>
  );
};

export default SecurityAllocation;
