import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileViewer = ({ preUrl }) => {
  // Check if the URL is empty

  let docs = [
    {
      uri: preUrl,
    },
  ];

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
    height: "7%",
    backgroundColor: "inherit",
    zIndex: 1,
  };

  return (
    <div style={containerStyles}>
      {/* Render DocViewer */}
      {/* <DocViewer
        prefetchMethod="GET"
        documents={docs}
        pluginRenderers={DocViewerRenderers}
      /> */}

      {/* Render iframe with overlay */}
      <div style={{ ...containerStyles, ...iframeStyles }}>
        <iframe
          title="Document Viewer"
          src={docs[0].uri}
          style={iframeStyles}
        />
        <div style={overlayStyles}></div>
      </div>
    </div>
  );
};

export default FileViewer;
