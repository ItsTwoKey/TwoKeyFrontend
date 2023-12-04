// import React from "react";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

// const FileViewer = () => {
//   // let preUrl = localStorage.getItem("preUrl");
//   let docs = [
//     {
//       uri: "https://dxqrkmzagreeiyncplzx.supabase.co/storage/v1/object/sign/TwoKey/BTL1Syllabus.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUd29LZXkvQlRMMVN5bGxhYnVzLnBkZiIsImlhdCI6MTcwMTI2NTA0NiwiZXhwIjoxNzAxODY5ODQ2fQ.FIjyI2qc30Sdrcf3D1hERYpCCaj166LlOBk1TPwC5xw&t=2023-11-29T13%3A37%3A26.209Z",
//     },
//   ];

//   return (
//     <div className="w-full h-[800px]">
//       <DocViewer
//         prefetchMethod="GET"
//         documents={docs}
//         pluginRenderers={DocViewerRenderers}
//       />
//     </div>
//   );
// };

// export default FileViewer;

import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileViewer = () => {
  let docs = [
    {
      uri: "https://dxqrkmzagreeiyncplzx.supabase.co/storage/v1/object/sign/TwoKey/BTL1Syllabus.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUd29LZXkvQlRMMVN5bGxhYnVzLnBkZiIsImlhdCI6MTcwMTI2NTA0NiwiZXhwIjoxNzAxODY5ODQ2fQ.FIjyI2qc30Sdrcf3D1hERYpCCaj166LlOBk1TPwC5xw&t=2023-11-29T13%3A37%3A26.209Z",
    },
  ];

  return (
    <div className="w-full h-[800px]">
      {/* Render DocViewer */}
      <DocViewer
        prefetchMethod="GET"
        documents={docs}
        pluginRenderers={DocViewerRenderers}
      />

      {/* Render iframe */}
      <iframe
        title="Document Viewer"
        src={docs[0].uri}
        width="100%"
        height="800px"
        frameBorder="0"
      />
    </div>
  );
};

export default FileViewer;
