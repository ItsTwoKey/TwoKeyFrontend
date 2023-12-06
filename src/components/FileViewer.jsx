import React, { useEffect, useState } from "react";

const FileViewer = ({ preUrl }) => {
  const [fileBlob, setFileBlob] = useState(null);

  useEffect(() => {
    const fetchFileBlob = async () => {
      try {
        // Fetch the data associated with the URL
        const response = await fetch(preUrl);

        // Get the data as a Blob
        const blob = await response.blob();

        // Set the Blob in the component state
        setFileBlob(blob);
      } catch (error) {
        console.error("Error fetching or creating Blob:", error);
      }
    };

    // Call the fetchFileBlob function only once when the component mounts
    fetchFileBlob();
  }, [preUrl]);

  const containerStyles = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    position: "relative",
  };

  const iframeStyles = {
    width: "100%",
    height: "100%",
  };

  const overlayStyles = {
    position: "absolute",
    top: "0",
    right: "0",
    width: "25%",
    height: "10%",
    backgroundColor: "inherit",
    zIndex: 1,
  };

  // Use a Blob URL if available, otherwise use the original preUrl
  const srcUrl = fileBlob ? URL.createObjectURL(fileBlob) : preUrl;

  return (
    <div style={containerStyles}>
      {/* Render iframe with Blob URL or original preUrl */}
      <div style={{ ...containerStyles, ...iframeStyles }}>
        <iframe title="Document Viewer" src={srcUrl} style={iframeStyles} />
        <div style={overlayStyles}></div>
      </div>
    </div>
  );
};

export default FileViewer;
