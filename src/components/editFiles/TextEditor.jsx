import React, { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as quillToWord from "quill-to-word";
import { supabase } from "../../helper/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

const toolbarOptions = [
  [
    {
      font: [],
    },
  ],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ script: "sub" }, { script: "super" }], // superscript/subscript

  [{ align: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  ["link", "image", "video", "formula"],
];

export default function TextEditor({ preUrl, fileName, fileId }) {
  const [quill, setQuill] = useState();
  const [content, setContent] = useState("");
  const quillRef = useRef(null);

  if (preUrl.trim() !== "") {
    fetchAndExtractContent(preUrl);
  }

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    setQuill(q);
  }, []);

  const saveToDocx = async (q) => {
    try {
      const delta = q.getContents();
      const quillToWordConfig = {
        exportAs: "blob",
      };
      const docAsBlob = await quillToWord.generateWord(
        delta,
        quillToWordConfig
      );

      // Upload the file to Supabase
      await saveToSupabase(docAsBlob);
    } catch (error) {
      console.error("Error generating Word document:", error);
    }
  };

  const saveToSupabase = async (file) => {
    try {
      const { data, error } = await supabase.storage
        .from("TwoKey")
        .update(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw new Error(error.message);
      }

      console.log("File uploaded to Supabase:", data);
      toast.success("File Edited successfully.");

      if (data) {
        let token = JSON.parse(secureLocalStorage.getItem("token"));
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/file/logEvent/${fileId}?event=edit`,

          {
            headers: {
              Authorization: `Bearer ${token.session.access_token}`,
            },
          }
        );
        console.log("edit log :", res);
      }
    } catch (error) {
      console.error("Error uploading Word document to Supabase:", error);
      // toast.error("Something went wrong.");
    }
  };

  async function convertDocxToQuill(docxFile) {
    try {
      const zip = await JSZip.loadAsync(docxFile);
      const documentXml = await zip.file("word/document.xml").async("string");
      const content = parseDocumentXml(documentXml); // parse the docx to xml
      quill.setContents(content);
    } catch (error) {
      console.error("Error converting .docx to Quill format:", error);
    }
  }

  function parseDocumentXml(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    let quillOps = [];

    // Iterate through the XML nodes representing paragraphs
    const paragraphNodes = xmlDoc.getElementsByTagName("w:p");
    for (let i = 0; i < paragraphNodes.length; i++) {
      const paragraphNode = paragraphNodes[i];

      // Extract text content and apply any formatting
      const ops = extractParagraphContent(paragraphNode);

      // Add the operations to the quillOps array
      quillOps = quillOps.concat(ops);
    }

    return { ops: quillOps };
  }

  function extractParagraphContent(paragraphNode) {
    let ops = [];

    // Iterate through the child nodes of the paragraph
    const childNodes = paragraphNode.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];

      // Check if the node contains text
      if (childNode.nodeName === "w:r") {
        const textOps = extractTextOps(childNode);
        ops = ops.concat(textOps);
      }

      // Check if the node contains formatting
      if (childNode.nodeName === "w:pPr") {
        const formatOps = extractFormatOps(childNode);
        ops = ops.concat(formatOps);
      }
    }

    // Add newline character after each paragraph
    ops.push({ insert: "\n" });

    return ops;
  }

  function extractTextOps(runNode) {
    let ops = [];

    // Extract text content
    const textNode = runNode.getElementsByTagName("w:t")[0];
    if (textNode) {
      const textContent = textNode.textContent;

      // Check for bold, italic, underline, etc.
      const isBold = !!runNode.getElementsByTagName("w:b").length;
      const isItalic = !!runNode.getElementsByTagName("w:i").length;
      const isUnderline = !!runNode.getElementsByTagName("w:u").length;

      // Add text operations with formatting
      let textOp = { insert: textContent };
      if (isBold) textOp = { ...textOp, attributes: { bold: true } };
      if (isItalic) textOp = { ...textOp, attributes: { italic: true } };
      if (isUnderline) textOp = { ...textOp, attributes: { underline: true } };

      ops.push(textOp);
    }

    return ops;
  }

  function extractFormatOps(paragraphPropsNode) {
    let ops = [];

    // Check for heading levels
    const headingLevel = extractHeadingLevel(paragraphPropsNode);
    if (headingLevel) {
      ops.push({ insert: "\n", attributes: { header: headingLevel } });
    }

    // Check for list items
    const listType = extractListType(paragraphPropsNode);
    if (listType) {
      ops.push({ insert: "\n", attributes: { list: listType } });
    }

    return ops;
  }

  function extractHeadingLevel(paragraphPropsNode) {
    const headingNodes = paragraphPropsNode.getElementsByTagName("w:pStyle");
    for (let i = 0; i < headingNodes.length; i++) {
      const headingNode = headingNodes[i];
      const styleId = headingNode.getAttribute("w:val");
      if (styleId && styleId.startsWith("Heading")) {
        return parseInt(styleId.replace("Heading", ""), 10);
      }
    }
    return null;
  }

  function extractListType(paragraphPropsNode) {
    const numberingNodes = paragraphPropsNode.getElementsByTagName("w:numPr");
    for (let i = 0; i < numberingNodes.length; i++) {
      const numberingNode = numberingNodes[i];
      const listId = numberingNode
        .getElementsByTagName("w:numId")[0]
        ?.getAttribute("w:val");
      if (listId) {
        return "ordered";
      }
    }

    const bulletNodes = paragraphPropsNode.getElementsByTagName("w:bulleted");
    if (bulletNodes.length > 0) {
      return "bullet";
    }

    return null;
  }

  //   read file from internet source
  async function fetchAndExtractContent(wordFileUrl) {
    try {
      // Fetch the Word file
      const response = await fetch(wordFileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the Word file");
      }

      // Convert response to blob
      const blob = await response.blob();
      convertDocxToQuill(blob);
    } catch (error) {
      console.error("Error fetching and extracting content:", error);
    }
  }

  return (
    <>
      <div className="">
        <Toaster position="bottom-left" reverseOrder={false} />
        <style>
          {`body {
            background-color: #F3F3F3;
            margin: 0;
          }
          
          .container .ql-editor {
            width: 8.5in;
            min-height: 11in;
            padding: 1in;
            margin: 1rem;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, .5);
            background-color: white;
          }

          .container .ql-container.ql-snow {
            border: none;
            display: flex;
            justify-content: center;
            overflow-y: scroll;
            max-height: 85vh;
            min-height: 50vh;
          }

          .container .ql-toolbar.ql-snow {
            display: flex;
            justify-content: center;
            position: sticky;
            top: 0;
            z-index: 5;
            background-color: #F3F3F3;
            border: none;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, .5);
          }

          @page {
            margin: 1in;
          }

          @media print {
            body {
              background: none;
            }
            
            .container .ql-editor {
              width: 6.5in;
              height: 9in;
              padding: 0;
              margin: 0;
              box-shadow: none;
              align-self: flex-start;
            }
            
            .container .ql-toolbar.ql-snow {
              display: none;
            }
          }`}
        </style>
        <div className="flex justify-end">
          <button
            className="bg-slate-600 hover:bg-slate-800 text-white px-4 py-2 rounded-lg m-2 "
            onClick={() => saveToDocx(quill)}
          >
            Save
          </button>
        </div>
        <div>{content}</div>
        <div className="container" ref={wrapperRef}></div>
      </div>
    </>
  );
}
