import React, { useState, useEffect } from "react";

const IPDetector = () => {
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org/?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIpAddress();
  }, []);

  return (
    <div>
      <h1>Your IP address: {ipAddress}</h1>
      <pre>{navigator.userAgent}</pre>
      {/* <pre>{navigator.userAgentData.mobile}</pre> */}
      {/* <pre>{navigator.userAgentData.platform}</pre> */}
    </div>
  );
};

export default IPDetector;
