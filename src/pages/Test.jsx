import React, { useState } from "react";
import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";
import * as pdfjs from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker";

function str2xml(str) {
  if (str.charCodeAt(0) === 65279) {
    // BOM sequence
    str = str.substr(1);
  }
  return new DOMParser().parseFromString(str, "text/xml");
}

function getParagraphsFromDocx(content) {
  const zip = new PizZip(content);
  const xml = str2xml(zip.files["word/document.xml"].asText());
  const paragraphsXml = xml.getElementsByTagName("w:p");
  let paragraphs = "";

  for (let i = 0, len = paragraphsXml.length; i < len; i++) {
    let fullText = "";
    const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
    for (let j = 0, len2 = textsXml.length; j < len2; j++) {
      const textXml = textsXml[j];
      if (textXml.childNodes) {
        fullText += textXml.childNodes[0].nodeValue;
      }
    }
    if (fullText) {
      paragraphs += fullText + " "; // Add space between paragraphs
    }
  }
  return paragraphs.trim(); // Remove trailing space
}

const PdfTextExtractorAndDocxReader = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const userAgent = navigator.userAgent;
  console.log("User Agent:", userAgent);

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
              extractedText += pageText + " "; // Add space between pages
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
          } else if (file.name.endsWith(".docx")) {
            // Extract paragraphs from Docx and store in the same variable
            extractedText = getParagraphsFromDocx(reader.result);
          } else {
            console.error(
              "Unsupported file format. Please choose a PDF, text, CSV, or Docx file."
            );
            return;
          }

          setResult(extractedText.trim()); // Remove trailing space
        } catch (error) {
          console.error("Error extracting text:", error);
        }
      };

      // Use reader.readAsText for text and CSV files
      if (
        file.name.endsWith(".txt") ||
        file.type.startsWith("text/") ||
        file.name.endsWith(".csv") ||
        file.type === "application/vnd.ms-excel"
      ) {
        reader.readAsText(file);
      } else if (file.name.endsWith(".pdf") || file.name.endsWith(".docx")) {
        reader.readAsArrayBuffer(file);
      } else {
        console.error("Unsupported file format. Please choose a valid file.");
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
        <p>{result}</p>
      </div>
    </div>
  );
};

export default PdfTextExtractorAndDocxReader;
