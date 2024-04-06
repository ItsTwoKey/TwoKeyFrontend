import React, { useEffect, useState } from "react";

const FileViewer = ({ preUrl }) => {
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

  console.log(preUrl)
  return (
    <div style={containerStyles}>
      {/* Render iframe with Blob URL or original preUrl */}
      <div style={{ ...containerStyles, ...iframeStyles }}>
        <iframe title="Document Viewer" src={preUrl} style={iframeStyles} />
        <div style={overlayStyles}></div>
      </div>
    </div>
  );
};

export default FileViewer;
