import React, { useEffect, useState } from "react";
import TextEditor from "./editFiles/TextEditor";
import CustomFileViewer from "./CustomFileViewer";

const FileViewer = ({ preUrl, mimetype, signedUrl }) => {
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

  let viewerComponent;

  switch (mimetype) {
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      viewerComponent = <TextEditor preUrl={preUrl} />;
      break;
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    case "text/csv":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      viewerComponent = (
        <CustomFileViewer preUrl={signedUrl} mimetype={mimetype} />
      );
      break;
    default:
      viewerComponent = (
        <div style={{ ...containerStyles, ...iframeStyles }}>
          <iframe title="Document Viewer" src={preUrl} style={iframeStyles} />
          <div style={overlayStyles}></div>
        </div>
      );
  }

  return (
    <div style={containerStyles} className=" overflow-y-scroll scrollbar-hide">
      {viewerComponent}
    </div>
  );
};

export default FileViewer;
