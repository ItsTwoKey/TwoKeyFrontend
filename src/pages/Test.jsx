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

import React, { useState } from "react";
import * as pdfjs from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker";

const PdfTextExtractor = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleExtractText = () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          let extractedText = "";

          // Check the file type
          if (file.name.endsWith(".pdf")) {
            // Extract text from PDF
            const loadingTask = pdfjs.getDocument({ data: reader.result });
            const pdfDocument = await loadingTask.promise;

            for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
              const page = await pdfDocument.getPage(pageNum);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item) => item.str)
                .join(" ");
              extractedText += pageText;
            }
          } else if (
            file.name.endsWith(".txt") ||
            file.type.startsWith("text/")
          ) {
            // Read text file
            extractedText = reader.result;
          } else if (
            file.name.endsWith(".csv") ||
            file.type === "application/vnd.ms-excel"
          ) {
            // Read CSV file
            extractedText = reader.result;
          } else {
            console.error(
              "Unsupported file format. Please choose a PDF, text, or CSV file."
            );
            return;
          }

          setText(extractedText);
        } catch (error) {
          console.error("Error extracting text:", error);
        }
      };

      // Use reader.readAsText for text and CSV files
      if (file.name.endsWith(".pdf")) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    } else {
      console.error("Please choose a file.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleExtractText}>Extract Text</button>
      <div>
        <h2>Extracted Text:</h2>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default PdfTextExtractor;
