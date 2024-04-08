import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileViewer = (preUr) => {
  let docs = [
    {
      uri: "https://cderhtrlfxroiyqqzytr.supabase.co/storage/v1/object/sign/TwoKey/two.pptx_TS=1712565332085?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUd29LZXkvdHdvLnBwdHhfVFM9MTcxMjU2NTMzMjA4NSIsImlhdCI6MTcxMjU2NTcwOSwiZXhwIjoxNzEzMTcwNTA5fQ.AJWUv0jR7VfN0SQVKNjgH24ZIsgdg-qiqsMYjD3KzPY&t=2024-04-08T08%3A41%3A48.197Z",
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

export default FileViewer;
