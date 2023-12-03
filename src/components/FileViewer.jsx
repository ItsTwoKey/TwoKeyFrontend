import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileViewer = () => {
  let docs = [
    {
      uri: "https://dxqrkmzagreeiyncplzx.supabase.co/storage/v1/object/sign/TwoKey/BTL1Syllabus.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUd29LZXkvQlRMMVN5bGxhYnVzLnBkZiIsImlhdCI6MTcwMTI2NTA0NiwiZXhwIjoxNzAxODY5ODQ2fQ.FIjyI2qc30Sdrcf3D1hERYpCCaj166LlOBk1TPwC5xw&t=2023-11-29T13%3A37%3A26.209Z",
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
