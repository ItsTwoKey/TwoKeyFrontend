import React, { useState, useEffect } from "react";

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import { gapi } from "gapi-script";
import { api } from "../utils/axios-instance";
import { auth } from "../helper/firebaseClient";

import {
  Avatar,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import ComposeEmail from "./ComposeEmail";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
];

const DisplayEmails = ({ emails, onEmailsFetched }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsSignedIn);
          const freshToken = authInstance.currentUser
            .get()
            .getAuthResponse(true).access_token;

          // Check if credentials are stored in local storage
          const token = localStorage.getItem("google_token");
          // const refreshToken = localStorage.getItem("google_refresh_token");
          if (freshToken || token) {
            fetchEmails(freshToken || token);
          }
        });
    }

    gapi.load("client:auth2", start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignIn = async () => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (!isSignedIn) {
      const user = await authInstance.signIn({ prompt: "consent" });
      const refreshToken = user.getAuthResponse(true).refresh_token;
      const authResponse = user.getAuthResponse(true);
      const token = authResponse.access_token;

      // Store the tokens in local storage
      localStorage.setItem("google_token", token);
      localStorage.setItem("google_refresh_token", refreshToken);

      fetchEmails(token);
    } else {
      const authResponse = authInstance.currentUser.get().getAuthResponse(true);

      const token = authResponse.access_token;

      // Fetch emails with current token
      fetchEmails(token);
    }
  };

  const fetchEmails = async (token) => {
    setLoading(true);
    onEmailsFetched([]);
    const idToken = await auth.currentUser.getIdToken();
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
    const response = await api.post("/users/google_login/", {
      idToken,
      token,
      clientId,
      clientSecret, // You need to store this securely
    });
    const data = response.data;
    onEmailsFetched(data.emails);
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(false);
    const authInstance = gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    localStorage.removeItem("google_token");
    localStorage.removeItem("google_refresh_token");
    onEmailsFetched([]);
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    if (name && name.split(" ").length >= 2) {
      return {
        sx: {
          bgcolor: stringToColor(name),
        },
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
      };
    } else {
      return {
        sx: {
          bgcolor: "#B3A9EB", // Default color or handle as necessary
        },
        children: "NA", // Default initials or handle as necessary
      };
    }
  }

  function truncateText(text, length) {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  }

  function extractName(from) {
    const match = from.match(/^(.*?)(?: <.*>)?$/);
    return match ? match[1] : from;
  }

  function formatTimeDifference(date) {
    const now = new Date();
    const emailDate = new Date(date);

    const days = differenceInDays(now, emailDate);
    const hours = differenceInHours(now, emailDate);
    const minutes = differenceInMinutes(now, emailDate);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }

  return (
    <div className="h-48">
      <Paper className="h-full px-4 pt-2 pb-4 overflow-y-hidden">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-500">Email Box</h2>
          <div className="flex items-center space-x-2">
            <ComposeEmail isSignedIn={isSignedIn} />
            <IconButton onClick={handleSignIn}>
              {isSignedIn ? (
                <ChangeCircleIcon className="cursor-pointer text-gray-500" />
              ) : (
                <Tooltip title="Connect your Google account" arrow>
                  <GoogleIcon className="cursor-pointer text-blue-400" />
                </Tooltip>
              )}
            </IconButton>
            {isSignedIn && (
              <IconButton onClick={handleLogout}>
                <LogoutIcon className="cursor-pointer text-red-400" />
              </IconButton>
            )}
          </div>
        </div>
        <div className="h-56 overflow-y-scroll scrollbar-hide pb-20">
          {Array.from({ length: loading ? 5 : 0 }).map((_, index) => (
            <div
              key={index}
              className="py-3 border-b rounded-lg flex items-center gap-2"
            >
              <Skeleton
                key={index}
                variant="rounded"
                width={50}
                height={40}
                className="mr-2"
              />

              <span className="w-full">
                <Skeleton className="w-2/5" height={20} />
                <Skeleton className="w-4/5" height={20} />
              </span>
            </div>
          ))}

          {emails.map((email, index) => (
            <Stack
              direction={"row"}
              key={email.id}
              spacing={2}
              className="my-6"
            >
              <Tooltip title={email.from_email} arrow>
                <Avatar
                  {...stringAvatar(extractName(email.from))}
                  variant="rounded"
                />
              </Tooltip>
              <div className="flex flex-grow justify-between items-center">
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold">
                    {extractName(email.from)}
                  </h3>
                  <p className="text-xs font-semibold text-gray-400">
                    {truncateText(email.subject, 40)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-400">
                  {formatTimeDifference(email.date)}
                </p>
              </div>
            </Stack>
          ))}
        </div>
      </Paper>
    </div>
  );
};

export default DisplayEmails;
