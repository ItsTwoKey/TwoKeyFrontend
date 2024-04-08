import React, { useState } from "react";
import axios from "axios";
import * as pdfjs from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker";
import TextEditor from "../components/editFiles/TextEditor";

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

  let wordFileUrl =
    "https://cderhtrlfxroiyqqzytr.supabase.co/storage/v1/object/sign/TwoKey/experiment%203.docx_TS=1712336462947?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUd29LZXkvZXhwZXJpbWVudCAzLmRvY3hfVFM9MTcxMjMzNjQ2Mjk0NyIsImlhdCI6MTcxMjQwMTkwMCwiZXhwIjoxNzEzMDA2NzAwfQ.ZDEl0x1T1ZnzExiPniDHngB3HAdbA7JEsuDKevWLttg&t=2024-04-06T11%3A11%3A40.400Z";

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

      <TextEditor preUrl={wordFileUrl} />
    </div>
  );
};

export default FileExtractorFromSupabase;
