import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileViewer = () => {
  // let preUrl = localStorage.getItem("preUrl");
  let docs = [
    {
      uri: "https://dxqrkmzagreeiyncplzx.supabase.co/storage/v1/object/sign/TwoKey/sdfd?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUd29LZXkvc2RmZCIsImlhdCI6MTcwMTI0Mjk2MSwiZXhwIjoxNzAxODQ3NzYxfQ.oyB_D2GcP8BEa4eucnFuuwJZZqLaaKt0Y_ajIoBPZKE&t=2023-11-29T07%3A29%3A21.843Z",
    },
  ];

  return (
    <DocViewer
      prefetchMethod="GET"
      documents={docs}
      pluginRenderers={DocViewerRenderers}
    />
  );
};

export default FileViewer;
