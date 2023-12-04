import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

export default function TestPage() {
  const [token, setToken] = useState(null);
  const { refreshAccessToken } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      const session_token = sessionStorage.getItem("token");
      setToken(JSON.parse(session_token));
      console.log(token && token.session);
    };

    fetchToken();
  }, []);

  const simulateExpiredToken = () => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const expiredToken = {
      session: {
        access_token: token.session.access_token,
        expires_at: currentTime - 60, // Set expiration time to 1 minute ago
        refresh_token: token.session.refresh_token,
      },
    };
    return expiredToken;
  };

  const makeApiRequest = () => {
    return new Promise((resolve) => {
      // Simulating an API request delay
      setTimeout(() => {
        console.log("API request completed");
        resolve();
      }, 2000);
    });
  };

  const testTokenRefresh = async () => {
    try {
      // Simulate an expired token
      const expiredToken = simulateExpiredToken();

      // Attempt API request with the expired token
      console.log("Attempting API request with expired token...");
      await makeApiRequest(expiredToken);
      console.log("API Response (Before Refresh): Success");

      // Trigger token refresh
      console.log("Refreshing token...");
      await refreshAccessToken();

      // Retry API request with the refreshed token
      console.log("Retrying API request with refreshed token...");
      await makeApiRequest();
      console.log("API Response (After Refresh): Success");

      console.log("Token refresh test complete.");
    } catch (error) {
      console.error("Token refresh test failed:", error);
    }
  };

  return (
  <>
    <div className="bg-slate-900 text-white">
      Test Page
      <code>{token && JSON.stringify(token.session)}</code>
    </div>
      <button className="px-4 py-2 rounded-md bg-slate-500" onClick={testTokenRefresh}>Test Token Refresh</button>
  </>
  );
}
