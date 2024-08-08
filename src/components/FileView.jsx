import React, { useState, useEffect, useCallback } from "react";
import FileViewer from "./FileViewer";
import FileDetails from "./FileDetails";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useAuth } from "../context/authContext";
import { auth } from "../helper/firebaseClient";
import { api } from "../utils/axios-instance";
import axios from "axios";
import Loading from "./Loading";

const FileView = ({ fileInfo, closeDrawer, sharedFileInfo }) => {
  const CACHE_NAME = "blob-cache";
  const MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // Cache duration in milliseconds (1 day)
  const { screenshotDetected, screenshotAlert } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [preUrl, setPreUrl] = useState("");
  const [signedUrl, setSignedUrl] = useState("");
  const [loadingUrl, setLoadingUrl] = useState(true);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    closeDrawer();
  };

  useEffect(() => {
    if (screenshotDetected) {
      console.log("Screenshot detected");
      screenshotAlert(fileInfo.id);
    }
  }, [screenshotDetected, fileInfo.id, screenshotAlert]);

  useEffect(() => {
    openDialog();
  }, []);

  useEffect(() => {
    openDialog();
  }, []);

  /**
   * Get the cached response for the file
   * @param {string} fileIdentfier - The file identifier
   * @returns {Promise<Response | null>} - The cached response or null if not found
   */
  const getCacheEntry = useCallback(
    async (fileIdentfier) => {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(fileIdentfier);
      if (!response) return null;

      const dateHeader = response.headers.get("sw-cache-date");
      if (!dateHeader) return null;

      const cacheTime = new Date(dateHeader).getTime();
      const currentTime = Date.now();

      if (currentTime - cacheTime > MAX_CACHE_AGE) {
        await cache.delete(fileIdentfier);
        return null;
      }

      return response;
    },
    [MAX_CACHE_AGE, fileInfo.id]
  );

  const getPresignedUrl = useCallback(async () => {
    try {
      setLoadingUrl(true);

      let token = await auth.currentUser.getIdToken();

      // Open the cache storage
      const cache = await caches.open(CACHE_NAME);
      console.log("Opened cache:", cache);

      // Check if the file is already in the cache
      const fileIdentfier = `${fileInfo.id}-${token}`;
      const cachedResponse = await getCacheEntry(fileIdentfier);
      if (cachedResponse) {
        console.log("Cached response found:", cachedResponse);
        const cachedBlob = await cachedResponse.blob();
        setPreUrl(URL.createObjectURL(cachedBlob));
      } else {
        console.log("No cached response found for URL:", fileIdentfier);
        const body = {
          latitude: 18.44623721673684,
          longitude: 73.82762833796289,
          idToken: token,
        };

        const presignedUrl = await api.post(
          `/file/getPresigned/${fileInfo.id}`,
          body
        );
        console.log('URL', presignedUrl);
        const url = presignedUrl.data.signed_url;
        setSignedUrl(url);

        // Fetch data from the URL
        const response = await axios.get(url, {
          responseType: "arraybuffer",
        });

        // Convert array buffer to blob
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        // Cache the blob
        const responseToCache = new Response(blob, {
          headers: {
            "Content-Type": response.headers["content-type"],
            "sw-cache-date": new Date().toISOString(),
          },
        });
        await cache.put(fileIdentfier, responseToCache);

        console.log("Response cached for URL:", fileIdentfier);

        // Convert blob to data URL
        const dataUrl = URL.createObjectURL(blob);
        setPreUrl(dataUrl);
      }
    } catch (error) {
      console.log("Error while getPresignedUrl", error);
    } finally {
      setLoadingUrl(false);
    }
  }, [fileInfo.id, getCacheEntry]);
  useEffect(() => {
    getPresignedUrl().then(() => {
      console.log("File fetched");
    });
  }, [fileInfo.id, getPresignedUrl]);

  if (loadingUrl) {
    return <Loading />;
  }

  console.log({ preUrl, signedUrl, fileInfo });

  return (
    <div className="">
      <Dialog open={isOpen} onClose={closeDialog} fullScreen>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
            margin: 0,
            padding: 0,
          }}
        >
          <div className={`flex `}>
            <div
              className={`w-4/5 ${screenshotDetected ? "blur" : ""} h-screen`}
            >
              {loadingUrl && (
                <div className="text-center pt-20">Fetching URL...</div>
              )}
              {!loadingUrl && preUrl ? (
                <FileViewer
                  preUrl={preUrl}
                  mimetype={fileInfo.mimetype}
                  signedUrl={signedUrl}
                  fileName={fileInfo.name}
                  fileId={fileInfo.id}
                />
              ) : (
                <div className="text-center pt-20">
                  You do not have access to the file.
                </div>
              )}
            </div>
            <div className="w-1/5">
              <FileDetails
                fileInfo={fileInfo}
                sharedFileInfo={sharedFileInfo}
                closeDrawer={closeDrawer}
                preUrl={preUrl}
                signedUrl={signedUrl}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileView;
