import React, { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as quillToWord from "quill-to-word";

// Define custom formats for table, table row, and table cell
const TableCell = Quill.import("blots/embed");
TableCell.tagName = "td";
Quill.register(TableCell);

const TableRow = Quill.import("blots/block");
TableRow.tagName = "tr";
Quill.register(TableRow);

const Table = Quill.import("blots/container");
Table.tagName = "table";
Quill.register(Table);

// Custom table formats
const tableFormats = {
  table: "table",
  "table-row": "table-row",
  "table-cell": "table-cell",
};

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
//   [{ table: "table" }], // Custom table button
];

export default function TextEditor() {
  const [quill, setQuill] = useState();
  const quillRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    convertDocxToQuill(file);
  };

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
      formats: tableFormats,
    });
    setQuill(q);
  }, []);

  const saveToDocx = async (q) => {
    const delta = q.getContents();
    const quillToWordConfig = {
      exportAs: "blob",
    };
    const docAsBlob = await quillToWord.generateWord(delta, quillToWordConfig);
    saveAs(docAsBlob, "word-export.docx");
  };

  async function convertDocxToQuill(docxFile) {
    try {
      const zip = await JSZip.loadAsync(docxFile);
      const documentXml = await zip.file("word/document.xml").async("string");
      const content = parseDocumentXml(documentXml);
      quill.setContents(content);
    } catch (error) {
      console.error("Error converting .docx to Quill format:", error);
    }
  }

  function parseDocumentXml(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    let quillOps = [];

    // Iterate through the XML nodes representing paragraphs and tables
    const paragraphNodes = xmlDoc.getElementsByTagName("w:p");
    const tableNodes = xmlDoc.getElementsByTagName("w:tbl");

    for (let i = 0; i < paragraphNodes.length; i++) {
      const paragraphNode = paragraphNodes[i];
      const ops = extractParagraphContent(paragraphNode);
      quillOps = quillOps.concat(ops);
    }

    for (let i = 0; i < tableNodes.length; i++) {
      const tableNode = tableNodes[i];
      const ops = extractTableContent(tableNode);
      quillOps = quillOps.concat(ops);
    }

    return { ops: quillOps };
  }

  function extractParagraphContent(paragraphNode) {
    let ops = [];
    const childNodes = paragraphNode.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (childNode.nodeName === "w:r") {
        const textOps = extractTextOps(childNode);
        ops = ops.concat(textOps);
      }
      if (childNode.nodeName === "w:pPr") {
        const formatOps = extractFormatOps(childNode);
        ops = ops.concat(formatOps);
      }
    }
    ops.push({ insert: "\n" });
    return ops;
  }

  function extractTextOps(runNode) {
    let ops = [];
    const textNode = runNode.getElementsByTagName("w:t")[0];
    if (textNode) {
      const textContent = textNode.textContent;
      const isBold = !!runNode.getElementsByTagName("w:b").length;
      const isItalic = !!runNode.getElementsByTagName("w:i").length;
      const isUnderline = !!runNode.getElementsByTagName("w:u").length;
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
    const headingLevel = extractHeadingLevel(paragraphPropsNode);
    if (headingLevel) {
      ops.push({ insert: "\n", attributes: { header: headingLevel } });
    }
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

  function extractTableContent(tableNode) {
    const ops = [];
    const rows = tableNode.getElementsByTagName("w:tr");

    // Iterate through table rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.getElementsByTagName("w:tc");
      const tableRow = [];

      // Iterate through table cells
      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        const paragraphs = cell.getElementsByTagName("w:p");
        const cellContent = [];

        // Iterate through paragraphs within the cell
        for (let k = 0; k < paragraphs.length; k++) {
          const paragraph = paragraphs[k];
          const ops = extractParagraphContent(paragraph);
          cellContent.push(...ops);
        }

        // Add cell content to table row
        tableRow.push({ insert: { tableCell: cellContent } });
      }

      // Add table row to delta
      ops.push({ insert: { tableRow } });
    }

    // Add newline character after the table
    ops.push({ insert: "\n" });

    return ops;
  }

  //   useEffect(() => {
  //     if (!quill) return;

  //     // Extend Quill to handle table insertion and rendering
  //     const tableModule = Quill.import("modules/table");
  //     const table = Quill.import("formats/table");
  //     const tableRow = Quill.import("formats/table/row");
  //     const tableCell = Quill.import("formats/table/cell");

  //     Quill.register(tableModule, true);
  //     Quill.register(table, true);
  //     Quill.register(tableRow, true);
  //     Quill.register(tableCell, true);

  //     quill.getModule("toolbar").addHandler("table", () => {
  //       const tableModule = quill.getModule("table");
  //       tableModule.insertTable(3, 3); // Example: Insert a 3x3 table
  //     });
  //   }, [quill]);

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
      saveAs(blob, "word-export.docx");
      await convertOnlineDocxToQuill(blob);
  
      // After converting the content, save it as .docx
      saveAsDocx();
    } catch (error) {
      console.error("Error fetching and extracting content:", error);
    }
  }
  
  async function convertOnlineDocxToQuill(docxBlob) {
    try {
      const zip = await JSZip.loadAsync(docxBlob);
      const documentXml = await zip.file("word/document.xml").async("string");
      const content = parseDocumentXml(documentXml); // parse the docx to xml
      quill.setContents(content);
    } catch (error) {
      console.error("Error converting .docx to Quill format:", error);
    }
  }
  
  function saveAsDocx() {
    try {
      const delta = quill.getContents();
      const quillToWordConfig = {
        exportAs: "blob",
      };
      const docAsBlob = quillToWord.generateWord(delta, quillToWordConfig);
      saveAs(docAsBlob, "word-export.docx");
    } catch (error) {
      console.error("Error generating Word document:", error);
    }
  }
  
  

  return (
    <>
      <div>
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
        <input type="file" onChange={handleFileChange} accept=".docx" />
        <input type="text" onChange={(e)=>fetchAndExtractContent(e.target.value)} accept=".docx" />
        <button
          className="bg-slate-600 text-white px-4 py-2 rounded-lg m-2"
          onClick={() => saveToDocx(quill)}
        >
          Save
        </button>
        <div className="container" ref={wrapperRef}></div>
      </div>
    </>
  );
}
