// import React, { useState, useEffect } from "react";

// const FileReaderComponent = () => {
//   const [fileText, setFileText] = useState("");
//   const [presignedUrl, setPresignedUrl] = useState("");
//   const [error, setError] = useState(null);

//   const fetchFileText = async () => {
//     try {
//       const response = await fetch(presignedUrl);
//       const text = await response.text();
//       setFileText(text);
//       setError(null);
//     } catch (error) {
//       setFileText("");
//       setError("Error fetching file. Please check the URL and try again.");
//     }
//   };

//   useEffect(() => {
//     if (presignedUrl) {
//       fetchFileText();
//     }
//   }, [presignedUrl]);

//   const handleInputChange = (event) => {
//     setPresignedUrl(event.target.value);
//   };

//   const handleCopyToClipboard = () => {
//     navigator.clipboard.writeText(fileText);
//   };

//   return (
//     <div>
//       <label>
//         Enter Supabase Presigned URL:
//         <input type="text" value={presignedUrl} onChange={handleInputChange} />
//       </label>
//       <button onClick={fetchFileText}>Fetch File</button>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <h2>File Content:</h2>
//       <pre>{fileText}</pre>

//       {fileText && (
//         <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
//       )}
//     </div>
//   );
// };

// export default FileReaderComponent;

// import React, { useState } from "react";
// import * as pdfjs from "pdfjs-dist/build/pdf";
// import "pdfjs-dist/build/pdf.worker";

// const PdfTextExtractor = () => {
//   const [file, setFile] = useState(null);
//   const [text, setText] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleExtractText = () => {
//     if (file) {
//       const reader = new FileReader();

//       reader.onload = async () => {
//         try {
//           let extractedText = "";

//           // Check the file type
//           if (file.name.endsWith(".pdf")) {
//             // Extract text from PDF
//             const loadingTask = pdfjs.getDocument({ data: reader.result });
//             const pdfDocument = await loadingTask.promise;

//             for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
//               const page = await pdfDocument.getPage(pageNum);
//               const textContent = await page.getTextContent();
//               const pageText = textContent.items
//                 .map((item) => item.str)
//                 .join(" ");
//               extractedText += pageText;
//             }
//           } else if (
//             file.name.endsWith(".txt") ||
//             file.type.startsWith("text/")
//           ) {
//             // Read text file
//             extractedText = reader.result;
//           } else if (
//             file.name.endsWith(".csv") ||
//             file.type === "application/vnd.ms-excel"
//           ) {
//             // Read CSV file
//             extractedText = reader.result;
//           } else {
//             console.error(
//               "Unsupported file format. Please choose a PDF, text, or CSV file."
//             );
//             return;
//           }

//           setText(extractedText);
//         } catch (error) {
//           console.error("Error extracting text:", error);
//         }
//       };

//       // Use reader.readAsText for text and CSV files
//       if (file.name.endsWith(".pdf")) {
//         reader.readAsArrayBuffer(file);
//       } else {
//         reader.readAsText(file);
//       }
//     } else {
//       console.error("Please choose a file.");
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleExtractText}>Extract Text</button>
//       <div>
//         <h2>Extracted Text:</h2>
//         <p>{text}</p>
//       </div>
//     </div>
//   );
// };

// export default PdfTextExtractor;

import React, { useState } from "react";
import * as tus from "tus-js-client";
import { supabase } from "../helper/supabaseClient";
import LinearProgress from "@mui/material/LinearProgress";

const SupabaseUploader = () => {
  const projectId = process.env.REACT_APP_SUPABASE_PROJECT_REF;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
    setUploadProgress(Array(files.length).fill(0)); // Initialize progress for each file
  };

  const uploadFile = async (bucketName, fileName, file, index) => {
    try {
      let token = JSON.parse(sessionStorage.getItem("token"));

      const upload = new tus.Upload(file, {
        endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${token.session.access_token}`,
          "x-upsert": "true",
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: bucketName,
          objectName: fileName,
          contentType: file.type,
          cacheControl: 3600,
        },
        chunkSize: 6 * 1024 * 1024,
        onError: function (error) {
          console.error("Failed because:", error);
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          const updatedProgress = [...uploadProgress];
          updatedProgress[index] = Number(percentage);
          setUploadProgress(updatedProgress);
        },
        onSuccess: function () {
          console.log(`Download ${upload.file.name} from ${upload.url}`);
        },
      });

      // Check if there are any previous uploads to continue.
      const previousUploads = await upload.findPreviousUploads();
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      upload.start();
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      const sampleBucketName = "TwoKey";

      selectedFiles.forEach((file, index) => {
        const sampleFileName = file.name;
        uploadFile(sampleBucketName, sampleFileName, file, index);
      });
    } else {
      console.error("No files selected for upload");
    }
  };

  return (
    <div>
      <h1>Supabase File Uploader</h1>
      <input type="file" onChange={handleFileChange} multiple />
      <button onClick={handleUpload}>Upload</button>
      {uploadProgress.map(
        (progress, index) =>
          progress > 0 && (
            <LinearProgress
              key={index}
              variant="determinate"
              value={progress}
            />
          )
      )}
    </div>
  );
};

export default SupabaseUploader;
