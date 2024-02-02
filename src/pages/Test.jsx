import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileViewer = () => {
  let docs = [
    {
      uri: "https://dxqrkmzagreeiyncplzx.supabase.co/storage/v1/object/sign/TwoKey/two.pptx_TS=1706855564186?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUd29LZXkvdHdvLnBwdHhfVFM9MTcwNjg1NTU2NDE4NiIsImlhdCI6MTcwNjg1NTYxNSwiZXhwIjoxNzA3NDYwNDE1fQ.3qx_7Td5SctbqYTwijNWsZKePwKoE5-1k_zZ9pLqmUk&t=2024-02-02T06%3A33%3A35.412Z",
    },
  ];

  return (
    <div className="h-full">
      {/* Render DocViewer */}
      <DocViewer
        prefetchMethod="GET"
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        style={{ height: "100%" }}
        theme={{
          primary: "#5296d8",
          secondary: "#ffffff",
          tertiary: "#5296d899",
          text_primary: "#ffffff",
          text_secondary: "#5296d8",
          text_tertiary: "#00000099",
          disableThemeScrollbar: false,
        }}
      />
    </div>
  );
};

export default FileViewer;
