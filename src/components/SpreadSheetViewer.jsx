import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "@inovua/reactdatagrid-community/index.css";
import "@inovua/reactdatagrid-community/theme/default-light.css";
import {
  SpreadsheetComponent,
  SheetsDirective,
  SheetDirective,
  RangesDirective,
  RangeDirective,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-spreadsheet";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import PDF from "../assets/pdf.svg";

import { useAuth } from "../context/authContext";
import { auth, storage } from "../helper/firebaseClient";
import { Button } from "@mui/joy";

const CACHE_NAME = "blob-cache";

const Spread = ({ preUrl, mimetype, fileName, fileId, setSaving }) => {
  if (!preUrl) alert("Please provide a valid URL");
  const spreadsheetRef = useRef(null);
  const { profileData, profileIsPending } = useAuth();
  const deptId = useMemo(() => profileData?.dept ?? null, [profileData?.dept]);
  const [_, setUploadProgress] = useState(0);

  const beforeSave = (args) => {
    args.needBlobData = true; // To trigger the saveComplete event.
    args.isFullPost = false; // Get the spreadsheet data as blob data in the saveComplete event.
  };

  const saveComplete = (args) => {
    console.log({ args });
    let reader = new FileReader();
    reader.readAsArrayBuffer(args.blobData);
    reader.onloadend = function () {
      const arrayBuffer = reader.result;
      const fileBuffer = new Uint8Array(arrayBuffer);
      saveFile(fileBuffer);
    };
  };

  const fetchFileData = useCallback(() => {
    try {
      let spreadSheet = spreadsheetRef.current;

      fetch(preUrl)
        .then((response) => response.blob())
        .then((fileBlob) => {
          let file = new File([fileBlob], "Sample.xlsx");
          console.log("Opening file", file);
          spreadSheet.open({ file: file });
        });
    } catch (error) {
      console.error("Error fetching or processing the file:", error);
    }
  }, [preUrl]);

  useEffect(() => {
    fetchFileData();
  }, [preUrl, mimetype, fetchFileData]);

  const saveFile = (fileBuffer) => {
    const file = new Blob([fileBuffer], { type: mimetype });
    console.log("Uploading ...");
    uploadFile(file)
      .then(async () => {
        console.log("File saved successfully.", { file });
        const token = await auth.currentUser.getIdToken();
        const fileIdentfier = `${fileId}-${token}`;

        // update cache
        const cache = await caches.open(CACHE_NAME);
        const responseToCache = new Response(file, {
          headers: {
            "Content-Type": mimetype,
            "sw-cache-date": new Date().toISOString(),
          },
        });
        await cache.put(fileIdentfier, responseToCache);
        console.log("Cache updated for file:", fileIdentfier);
        setSaving(false);
      })
      .catch((error) => {
        console.error("File save error:", error);
      });
  };

  const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
      setSaving(true);
      const fileRef = ref(storage, `files/${profileData.org}/${file.id}`);
      const metadata = {
        customMetadata: {
          department_id: deptId,
          org_id: profileData.org,
        },
      };
      const uploadTask = uploadBytesResumable(fileRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("File upload error:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  if (profileIsPending) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Please wait...</p>
      </div>
    );
  }

  const Editorhieght = window.innerHeight - 64;

  return (
    <SpreadsheetComponent
      openUrl="https://services.syncfusion.com/react/production/api/spreadsheet/open"
      ref={spreadsheetRef}
      beforeSave={beforeSave}
      saveComplete={saveComplete}
      actionComplete={async (cell) => {
        console.log("action complete", cell);
        const spreadSheet = spreadsheetRef.current;
        if (cell.action === "cellSave") {
          spreadSheet.save({
            url: "https://services.syncfusion.com/react/production/api/spreadsheet/save",
          });
        }
      }}
      // style={{
      //   width: "100%",
      //   height: { Editorhieght },
      // }}
      height={Editorhieght}
      allowSave={true}
      saveUrl="https://services.syncfusion.com/react/production/api/spreadsheet/save"
    >
      <SheetsDirective>
        <SheetDirective name="Car Sales Report">
          <RangesDirective>
            <RangeDirective></RangeDirective>
          </RangesDirective>
          <ColumnsDirective>
            <ColumnDirective width={180}></ColumnDirective>
            <ColumnDirective width={130}></ColumnDirective>
            <ColumnDirective width={130}></ColumnDirective>
            <ColumnDirective width={180}></ColumnDirective>
            <ColumnDirective width={130}></ColumnDirective>
            <ColumnDirective width={120}></ColumnDirective>
          </ColumnsDirective>
        </SheetDirective>
      </SheetsDirective>
    </SpreadsheetComponent>
  );
};

export default Spread;
