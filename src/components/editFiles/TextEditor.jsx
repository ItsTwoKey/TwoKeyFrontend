import React, { useCallback, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import JSZip from "jszip";
import * as quillToWord from "quill-to-word";
import toast, { Toaster } from "react-hot-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../../helper/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../../context/authContext";

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
  const { profileData } = useAuth();

  if (preUrl.trim() !== "") {
    fetchAndExtractContent(preUrl);
  }

  const wrapperRef = useCallback(
    (wrapper) => {
      if (wrapper == null) return;

      wrapper.innerHTML = "";
      const editor = document.createElement("div");
      wrapper.append(editor);
      const q = new Quill(editor, {
        theme: "snow",
        modules: { toolbar: toolbarOptions },
      });
      window.quill = q;
      setQuill(q);
    },
    [fileId]
  );

  const saveToDocx = async (q) => {
    try {
      const delta = q.getContents();
      const quillToWordConfig = {
        exportAs: "blob",
      };
      console.log(delta);
      const docAsBlob = await quillToWord.generateWord(
        delta,
        quillToWordConfig
      );

      // Upload the file to firebase storage
      await saveToFirebase(docAsBlob);
    } catch (error) {
      console.error("Error generating Word document:", error);
    }
  };

  const saveToFirebase = async (file) => {
    try {
      const fileRef = ref(storage, `files/${profileData.org}/${file.id}`);
      const snapshot = await uploadBytes(fileRef, file, {
        cacheControl: "3600",
      });

      console.log("File uploaded to Firebase Storage:", snapshot);
      toast.success("File saved successfully.");

      const downloadURL = await getDownloadURL(fileRef);
      console.log("File available at:", downloadURL);

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdToken();

          // const res = await axios.get(
          //   `${process.env.REACT_APP_BACKEND_BASE_URL}/file/logEvent/${fileId}?event=edit`,
          //   {
          //     headers: {
          //       Authorization: token,
          //     },
          //   }
          // );
          // console.log("edit log:", res);
        }
      });
    } catch (error) {
      console.error("Error uploading Word document to Firebase:", error);
      toast.error("Something went wrong.");
    }
  };

  async function convertDocxToQuill(docxFile) {
    try {
      const zip = await JSZip.loadAsync(docxFile);
      const documentXml = await zip.file("word/document.xml").async("string");
      const mediaFiles = zip.folder("word/media");

      const imageArray = [];

      // Collect all file read promises
      const filePromises = [];

      mediaFiles.forEach((relativePath, file) => {
        const promise = file.async("base64").then((base64Data) => {
          const fileName = relativePath.split("/").pop();

          // Add image to the array based on the index
          imageArray.push({
            url: `data:image/png;base64,${base64Data}`,
            name: fileName,
          });
        });
        filePromises.push(promise);
      });

      // Wait for all file read promises to resolve
      await Promise.all(filePromises);

      const content = parseDocumentXml(documentXml, imageArray);
      if (quill) {
        console.log(content);
        quill.setContents(content);
      }
    } catch (error) {
      console.error("Error converting .docx to Quill format:", error);
    }
  }

  function parseDocumentXml(xml, imageArray) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    let quillOps = [];

    // Iterate through the XML nodes representing paragraphs
    const paragraphNodes = xmlDoc.getElementsByTagName("w:p");
    for (let i = 0; i < paragraphNodes.length; i++) {
      const paragraphNode = paragraphNodes[i];

      // Extract text content and apply any formatting
      const ops = extractParagraphContent(paragraphNode, imageArray);

      // Add the operations to the quillOps array
      quillOps = quillOps.concat(ops);
    }

    return { ops: quillOps };
  }

  let noOfImages = 0;

  function extractParagraphContent(paragraphNode, imageArray) {
    console.log(paragraphNode, imageArray);
    let ops = [];
    function traverseNode(node) {
      // console.log(node.nodeName);
      // Check for image nodes directly or in nested elements
      if (node.nodeName === "w:p") {
        const textOps = extractTextOps(node);
        ops = ops.concat(textOps);
      } else if (node.nodeName === "w:drawing" || node.nodeName === "w:pict") {
        const imageOps = extractImageOps(node, imageArray);
        ops = ops.concat(imageOps);
      }

      // Traverse child nodes recursively
      for (let i = 0; i < node.childNodes.length; i++) {
        traverseNode(node.childNodes[i]);
      }
    }

    // Start traversing from the paragraph node
    traverseNode(paragraphNode);

    return ops;
  }

  function extractImageOps(drawingNode, imageArray) {
    let ops = [];
    // const blipNode = drawingNode.querySelector("a\\:blip");
    // console.log(blipNode);

    // if (blipNode) {
    //   const rId = blipNode.getAttribute("r:embed");
    //   const rIdNumber = parseInt(rId.replace("rId", ""));
    //   console.log(rIdNumber, "rIdNumber");

    //   // Check if the rIdNumber matches with the index of imageArray
    //   if (!isNaN(rIdNumber) && imageArray[rIdNumber - 1]) {
    //     ops.push({
    //       insert: {
    //         image: imageArray[rIdNumber - 1].url,
    //       },
    //     });
    //   }
    // }

    // Check for image nodes directly or in nested elements
    const blipNode = drawingNode.getElementsByTagName("a:blip")[0];
    if (blipNode) {
      const embedAttr = blipNode.getAttribute("r:embed");
      if (embedAttr) {
        const rIdNumber = parseInt(embedAttr.replace("rId", ""));
        console.log(rIdNumber, "rIdNumber");
        if (!isNaN(rIdNumber) && imageArray[noOfImages]) {
          ops.push({
            insert: {
              image: imageArray[noOfImages].url,
            },
          });
          noOfImages++;
        }
      }
    }
    return ops;
  }

  function extractTextOps(runNode) {
    let ops = [];

    // Extract text content
    const textNode = runNode.getElementsByTagName("w:t")[0];
    if (textNode) {
      const textContent = textNode.textContent;

      // Extract formatting
      const formatOps = extractFormatOps(runNode);

      const headingLevel = extractHeadingLevel(runNode);

      // Add text operations with formatting
      let textOp = { insert: textContent };
      if (Object.keys(formatOps).length > 0) {
        textOp = { ...textOp, attributes: formatOps };
      }
      ops.push(textOp);

      if (headingLevel) {
        ops.push({ attributes: { header: headingLevel }, insert: "\n" });
      }
      if (textContent !== "") {
        // Add a newline character after each paragraph
        // ops.push({ insert: "\n" });
      }
    }

    return ops;
  }

  function extractFormatOps(runNode) {
    let formatOps = {};

    // Check for text color
    const colorNode = runNode.getElementsByTagName("w:color")[0];
    if (colorNode) {
      const colorValue = colorNode.getAttribute("w:val");
      if (colorValue) {
        const quillColor = convertColor(colorValue);
        if (quillColor) {
          formatOps.color = quillColor;
        }
      }
    }

    // Check for text background color
    const highlightNode = runNode.getElementsByTagName("w:highlight")[0];
    if (highlightNode) {
      const backgroundColorValue = highlightNode.getAttribute("w:val");
      if (backgroundColorValue) {
        formatOps.background = backgroundColorValue;
      }
    }

    // Check for bold
    const boldNode = runNode.getElementsByTagName("w:b")[0];
    if (boldNode) {
      formatOps.bold = true;
    }

    // Check for italic
    const italicNode = runNode.getElementsByTagName("w:i")[0];
    if (italicNode) {
      formatOps.italic = true;
    }

    // Check for underline
    const underlineNode = runNode.getElementsByTagName("w:u")[0];
    if (underlineNode) {
      formatOps.underline = true;
    }

    // Check for heading level
    const headingLevel = extractHeadingLevel(runNode);

    if (headingLevel) {
      formatOps.header = headingLevel;
    }

    // Check for list items
    const listType = extractListType(runNode);
    if (listType) {
      formatOps.list = listType;
    }

    // Check for font size
    const fontSize = extractFontSize(runNode);
    if (fontSize) {
      formatOps.size = fontSize;
    }

    return formatOps;
  }
  function extractFontSize(paragraphPropsNode) {
    const fontSizeNode = paragraphPropsNode.getElementsByTagName("w:sz")[0];
    if (fontSizeNode) {
      const fontSizeValue = fontSizeNode.getAttribute("w:val");
      if (fontSizeValue) {
        // Convert font size value from half points to points (Quill uses points for font size)
        const fontSizeInPoints = parseInt(fontSizeValue) / 2;
        console.log(fontSizeInPoints, "fontSizeInPoints");
        return fontSizeInPoints;
      }
    }
    return null;
  }

  function convertColor(colorValue) {
    // Perform color conversion here
    const hex = colorValue.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgb(${r}, ${g}, ${b})`;
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
        {/* <div>{content}</div> */}
        <div className="container" ref={wrapperRef}></div>
      </div>
    </>
  );
}
