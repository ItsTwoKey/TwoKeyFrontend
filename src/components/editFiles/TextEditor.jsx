import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, storage } from "../../helper/firebaseClient";
import { useAuth } from "../../context/authContext";

import {
  DocumentEditorContainerComponent,
  Toolbar,
  WordExport,
} from "@syncfusion/ej2-react-documenteditor";

import "../../styles/DocEditor_styles.css";
import "../../styles/material.css";

DocumentEditorContainerComponent.Inject(Toolbar, WordExport);
const CACHE_NAME = "blob-cache";

export default function TextEditor({ preUrl, fileName, fileId, mimetype, setSaving }) {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const { profileData } = useAuth();

  useEffect(() => {
    if (isEditorReady && preUrl.trim() !== "") {
      fetchAndExtractContent(preUrl);
    }
    handleKeyBoardShortcuts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preUrl, isEditorReady]);

  function handleKeyBoardShortcuts() {
    editorRef.current.documentEditor.keyDown = function (args) {
      let keyCode = args.event.which || args.event.keyCode;
      let isCtrlKey =
        args.event.ctrlKey || args.event.metaKey
          ? true
          : keyCode === 17
            ? true
            : false;

      if (isCtrlKey && keyCode === 83) {
        //To prevent default save operation, set the isHandled property to true
        args.isHandled = true;

        editorRef.current.documentEditor.save(
          fileName.split(".").slice(0, -1).join("."),
          "Docx"
        );

        args.event.preventDefault();
      }
    };
  }

  // Save document to Firebase and cache
  const saveDocument = useCallback(
    async (showPopup) => {
      if (!isEditorReady) return;
      setSaving(true);
      const document =
        await editorRef.current.documentEditor.saveAsBlob("Docx");
      console.log("Document saved as blob:", document);

      // const fileBuffer = await document.arrayBuffer();

      // const file = new Blob([fileBuffer], { type: mimetype });
      const file = document;

      const fileRef = ref(storage, `files/${profileData.org}/${fileId}`);
      const metadata = {
        customMetadata: {
          department_id: profileData.dept,
          org_id: profileData.org,
        },
      };

      const uploadTask = uploadBytesResumable(fileRef, file, metadata);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("File upload error:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadURL);

          const token = await auth.currentUser.getIdToken();
          const fileIdentifier = `${fileId}-${token}`;

          // Cache the file

          const cache = await caches.open(CACHE_NAME);
          const responseToCache = new Response(file, {
            headers: {
              "Content-Type": mimetype,
              "sw-cache-date": new Date().toISOString(),
            },
          });
          await cache.put(fileIdentifier, responseToCache);
          console.log("Cache updated for file:", fileIdentifier);
          setSaving(false);

          if (showPopup) toast.success("File saved and cached successfully.");
        }
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEditorReady, profileData.org, profileData.dept, fileId, mimetype]
  );

  const fetchAndExtractContent = async (wordFileUrl) => {
    try {
      // Fetch the Word file
      const response = await fetch(wordFileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the Word file");
      }

      // Convert response to blob
      const blob = await response.blob();
      const file = new File([blob], fileName, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      editorRef.current.documentEditor.open(file);
    } catch (error) {
      console.error("Error fetching and extracting content:", error);
    }
  };

  let toolItem = {
    prefixIcon: "e-save icon",
    tooltipText: "Save the Document",
    text: "Save",
    id: "save",
  };
  let items = [
    toolItem,
    "New",
    "Open",
    "Separator",
    "Undo",
    "Redo",
    "Separator",
    "Image",
    "Table",
    "Hyperlink",
    "Bookmark",
    "TableOfContents",
    "Separator",
    "Header",
    "Footer",
    "PageSetup",
    "PageNumber",
    "Break",
    "InsertFootnote",
    "InsertEndnote",
    "Separator",
    "Find",
    "Separator",
    "Comments",
    "TrackChanges",
    "Separator",
    "LocalClipboard",
    "RestrictEditing",
    "Separator",
    "FormFields",
    "UpdateFields",
    "ContentControl",
  ];

  const onToolbarClick = (args) => {
    switch (args.item.id) {
      case "save":
        saveDocument(true);
        break;
      default:
        break;
    }
  };

  const Editorhieght = window.innerHeight - 64;

  return (
    <>
      <DocumentEditorContainerComponent
        id="container"
        height={Editorhieght}
        serviceUrl="https://services.syncfusion.com/vue/production/api/documenteditor/"
        enableToolbar={true}
        ref={(scope) => {
          editorRef.current = scope;
        }}
        toolbarItems={items}
        toolbarClick={onToolbarClick}
        created={() => setIsEditorReady(true)}
        contentChange={() => saveDocument(false)}
      />
    </>
  );
}
