import React, { useState } from "react";
import axios from "axios";
import * as pdfjs from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker";

const FileExtractorFromSupabase = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleExtractFile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        responseType: "blob",
        headers: {
          // Add any necessary headers for authentication
        },
      });

      const contentType = response.headers["content-type"];

      if (contentType === "application/pdf") {
        const pdfData = new Uint8Array(await response.data.arrayBuffer());
        const loadingTask = pdfjs.getDocument(pdfData);
        const pdfDocument = await loadingTask.promise;
        let extractedText = "";
        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          extractedText += pageText + " "; // Add space between pages
        }
        setResult(extractedText.trim());
      } else if (contentType === "text/plain" || contentType === "text/csv") {
        setResult(await response.data.text());
      } else {
        console.error(
          "Unsupported file format. Please choose a PDF, text, or CSV file."
        );
      }
    } catch (error) {
      console.error("Error extracting file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="text" value={url} onChange={handleUrlChange} />
      <button onClick={handleExtractFile} disabled={loading}>
        Extract Text
      </button>
      <div>
        <h2>Extracted Text:</h2>
        <pre>{loading ? "Loading..." : result}</pre>
      </div>
    </div>
  );
};

export default FileExtractorFromSupabase;
