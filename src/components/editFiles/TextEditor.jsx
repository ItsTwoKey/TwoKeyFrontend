import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

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

export default function TextEditor() {
  const [quill, setQuill] = useState();

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
        <div className="container" ref={wrapperRef}></div>
      </div>
    </>
  );
}
