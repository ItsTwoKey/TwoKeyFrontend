import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const CustomFileViewer = ({ preUrl }) => {
  let docs = [
    {
      uri: preUrl,
    },
  ];

  const containerStyles = {
    overflow: "hidden",
    position: "relative",
  };

  return (
    <div style={containerStyles} className="h-screen">
      {/* Render DocViewer */}
      <DocViewer
        prefetchMethod="GET"
        documents={docs}
        pluginRenderers={DocViewerRenderers}
      />
    </div>
  );
};

export default CustomFileViewer;
