import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { supabase } from "../helper/supabaseClient";
import secureLocalStorage from "react-secure-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [screenshotDetected, setScreenshotDetected] = useState(false);
  const [users, setUsers] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const detectPrintScreen = (event) => {
    const { key, code, metaKey, shiftKey, ctrlKey, altKey } = event;

    switch (true) {
      case metaKey && shiftKey && key === "3":
      case metaKey && shiftKey && key === "4":
      case metaKey && shiftKey && key === "6":
      case ctrlKey && key === "p":
      case altKey && (key === "PrintScreen" || key === "Insert"):
      case metaKey && (key === "PrintScreen" || key === "Insert"):
      case altKey && metaKey && (key === "PrintScreen" || key === "Insert"):
      case key === "PrintScreen" || key === "Insert":
      case metaKey && shiftKey && key === "s":
      case metaKey && shiftKey:
        event.preventDefault();
        console.log(`${event.key} pressed!`);

        setScreenshotDetected(true);

        // Remove the blur class after 3 seconds
        setTimeout(() => {
          setScreenshotDetected(false);
        }, 3000);
        // monitorClipboard();
        // checkClipboardForImage();
        screenshotAlert();
        break;

      default:
        break;
    }
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    console.log("Right-click prevented!");
  };

  useEffect(() => {
    document.addEventListener("keydown", detectPrintScreen);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("keydown", detectPrintScreen);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  const monitorClipboard = async () => {
    // Delay to allow the clipboard to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    navigator.clipboard
      .read()
      .then((clipText) => {
        console.log("Clipboard content changed:", clipText[0].types);
      })
      .catch((error) => {
        console.error("Error reading clipboard:", error);
      });
  };

  const checkClipboardForImage = async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    try {
      const data = await navigator.clipboard.read();
      const types = data[0].types;
      let hasImageType = false;

      for (const type of types) {
        if (type.startsWith("image")) {
          hasImageType = true;
          break;
        }
      }

      if (hasImageType) {
        console.log("Screenshot captured.", types);

        // Assuming the first item in the clipboard data is the image
        const imageBlob = await data[0].getType("image/png");
        await uploadImageToSupabase(imageBlob);
      } else {
        console.log("Clipboard data does not contain an image type.", types);
      }
    } catch (error) {
      console.error("Error reading clipboard:", error);
    }
  };

  const screenshotAlert = async (fileId) => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));

      if (fileId) {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/file/logEvent/${fileId}?event=screenshot`,

          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log("screenshot log :", res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImageToSupabase = async (imageBlob) => {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));

      const { data, error } = await supabase.storage
        .from("screenshots") // specify the bucket name
        .upload(`screenshot-${token.user.email}-${Date.now()}.png`, imageBlob, {
          contentType: "image/png",
        });

      if (error) {
        console.error("Error uploading image to Supabase:", error);
      } else {
        console.log("Image uploaded successfully:", data);
      }
    } catch (error) {
      console.error("Error uploading image to Supabase:", error);
    }
  };

  useEffect(() => {
    const sessionToken = secureLocalStorage.getItem("token");
    if (sessionToken) {
      setToken(sessionToken);
      // Fetch profile data when the token is set
      fetchProfileData();
    }
  }, []);

  // useEffect(() => {
  async function fetchRecentFiles() {
    try {
      let token = JSON.parse(secureLocalStorage.getItem("token"));

      const recentFilesFromBackend = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/files`,
        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );

      console.log("recentFilesFromBackend", recentFilesFromBackend);

      if (recentFilesFromBackend) {
        const mappedFiles = recentFilesFromBackend.data.map(async (file) => {
          try {
            const { data } = await supabase.storage
              .from("avatar")
              .getPublicUrl(file.owner_email);

            return {
              id: file.id,
              name: file.name.substring(0, 80),
              size: formatFileSize(file.metadata.size),
              dept: file.dept_name,
              publicUrl: data.publicUrl,
              owner: file.owner_email,
              mimetype: file.metadata.mimetype,
              status: "Team",
              security: "Enhanced",
              lastUpdate: new Date(file.metadata.lastModified).toLocaleString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }
              ),
            };
          } catch (error) {
            console.log("Error while getting public URL:", error);
            return null;
          }
        });

        const resolvedFiles = await Promise.all(mappedFiles);
        const filteredFiles = resolvedFiles.filter((file) => file !== null);
        // console.log("Files:", filteredFiles);

        setFilteredData(filteredFiles);
        // localStorage.setItem("filteredFiles", JSON.stringify(filteredFiles));
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }

  //   fetchRecentFiles();
  // }, []);

  function formatFileSize(sizeInBytes) {
    const units = ["B", "KB", "MB", "GB"];
    let size = sizeInBytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return size.toFixed(2) + " " + units[unitIndex];
  }

  async function fetchProfileData() {
    try {
      let token = secureLocalStorage.getItem("token");

      if (token) {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/getProfileInfo/`,
          { idToken: token }
        );

        // Set the profile data in the state
        setProfileData(res.data);
        secureLocalStorage.setItem("profileData", JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.log("error occurred while fetching profile data", error);
    }
  }

  const setSessionToken = (newToken) => {
    setToken(newToken);
    secureLocalStorage.setItem("token", JSON.stringify(newToken));
  };

  const openFileViewer = () => {
    setIsFileViewerOpen(true);
  };

  const closeFileViewer = () => {
    setIsFileViewerOpen(false);
  };

  function getGeolocation() {
    let watchId;

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { coords } = position;
          setLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported in your browser.");
    }

    // Clean up the watch when the component unmounts
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }

  const listLocations = async () => {
    let token = JSON.parse(secureLocalStorage.getItem("token"));
    try {
      const locations = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/file/file/listLocation`,

        {
          headers: {
            Authorization: `Bearer ${token.session.access_token}`,
          },
        }
      );
      // console.log("locations :", locations.data.features);
      setCoordinates(locations.data.features);
    } catch (error) {
      console.log("Error while listing location Coordinates.", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      console.log("Refreshing token...");
      let token = JSON.parse(secureLocalStorage.getItem("token"));

      if (!token) {
        console.log("No token available");
        return;
      }
      const refresh_token = token.session.refresh_token;
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token,
      });
      if (data && data.session) {
        console.log("Token Refreshed Successfully", data);
        setSessionToken(data);
      } else if (error || !data) {
        console.error("Error refreshing token:", error);
      }
    } catch (error) {
      // handle error accordingly
      console.error("Error refreshing token:", error);
    }
  };

  const contextValue = {
    isFileViewerOpen,
    openFileViewer,
    closeFileViewer,
    token,
    setToken,
    setSessionToken,
    screenshotDetected,
    location,
    error,
    getGeolocation,
    users,
    profileData,
    setProfileData,
    fetchProfileData,
    listLocations,
    coordinates,
    fetchRecentFiles,
    filteredData,
    screenshotAlert,
    formatFileSize,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
