import React, { useState, useEffect } from "react";
import FileViewer from "./FileViewer";
import FileDetails from "./FileDetails";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useAuth } from "../context/authContext";
import { auth } from "../helper/firebaseClient";
import { api } from "../utils/axios-instance";
import axios from "axios";

const FileView = ({ fileInfo, closeDrawer, sharedFileInfo }) => {
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
      screenshotAlert(fileInfo.id);
    }
  }, [screenshotDetected, fileInfo.id, screenshotAlert]);

  useEffect(() => {
    openDialog();
  }, []);

  useEffect(() => {
    openDialog();
  }, []);

  useEffect(() => {
    const getPresignedUrl = async () => {
      try {
        let token = await auth.currentUser.getIdToken();

        const body = {
          latitude: 18.44623721673684,
          longitude: 73.82762833796289,
          idToken: token,
        };

        const presignedUrl = await api.post(
          `/file/getPresigned/${fileInfo.id}`,
          body
        );

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

        // Convert blob to data URL
        const dataUrl = URL.createObjectURL(blob);
        // console.log("blob", dataUrl);

        setPreUrl(dataUrl);
        setLoadingUrl(false);
      } catch (error) {
        console.log("Error while getPresignedUrl", error);
        setLoadingUrl(false);
      }
    };

    getPresignedUrl();
    // setPreUrl(fileInfo.download_url);

    setLoadingUrl(false);
  }, [fileInfo.id]);

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
            <div className={`w-4/5 ${screenshotDetected ? "blur" : ""}`}>
              {loadingUrl ? (
                <div className="text-center pt-20">Fetching URL...</div>
              ) : preUrl ? (
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
