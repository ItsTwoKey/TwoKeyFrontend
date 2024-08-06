import React from "react";
import TextEditor from "./editFiles/TextEditor";
import CustomFileViewer from "./CustomFileViewer";
import SpreadsheetComponent from "./SpreadSheetViewer";

const FileViewer = ({ preUrl, mimetype, signedUrl, fileName, fileId }) => {
  const containerStyles = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

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
    backgroundColor: "inherit",
    zIndex: 1,
  };

  let viewerComponent;

  switch (mimetype) {
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      viewerComponent = (
        <TextEditor preUrl={preUrl} fileName={fileName} fileId={fileId} />
      );
      break;
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    case "text/csv":
      viewerComponent = (
        <CustomFileViewer preUrl={signedUrl} mimetype={mimetype} />
      );
      break;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      viewerComponent = (
        <SpreadsheetComponent
          preUrl={signedUrl}
          mimetype={mimetype}
          fileName={fileName}
        />
      );
      break;
    default:
      viewerComponent = (
        <div style={containerStyles}>
          {mimetype.split("/")[0] === "image" ? (
            <img
              src={preUrl}
              alt="Document"
              style={{
                maxWidth: "50%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : (
            <iframe title="Document" src={preUrl} style={iframeStyles} />
          )}
          <div style={overlayStyles}></div>
        </div>
      );
  }

  return (
    console.log(preUrl, mimetype, signedUrl, fileName, fileId),
    (
      <div
        style={containerStyles}
        className=" overflow-y-scroll scrollbar-hide"
      >
        {viewerComponent}
      </div>
    )
  );
};

export default FileViewer;
