import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import "@inovua/reactdatagrid-community/index.css";
import "@inovua/reactdatagrid-community/theme/default-light.css";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import * as XLSX from "xlsx-js-style";
import { useAuth } from "../context/authContext";
import { storage } from "../helper/firebaseClient";
import { Button } from "@mui/joy";

const SpreadsheetComponent = ({ preUrl, mimetype, fileName }) => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const idleTimeoutRef = useRef(null);
  const { profileData, profileIsPending } = useAuth();
  const deptId = useMemo(() => profileData?.dept ?? null, [profileData?.dept]);
  const [uploadProgress, setUploadProgress] = useState(0);

  console.log({ deptId });

  const padHeaderRows = (sheetData) => {
    let headerRows = [];
    let dataRows = [];
    let maxColumns = 0;

    for (let row of sheetData) {
      if (row.length > maxColumns) {
        maxColumns = row.length;
      }
    }

    for (let row of sheetData) {
      if (
        row.every((cell) => typeof cell === "string") &&
        row.length < maxColumns
      ) {
        const paddedRow = [
          ...row,
          ...new Array(maxColumns - row.length).fill(""),
        ];
        headerRows.push(paddedRow);
      } else {
        dataRows.push(row);
      }
    }

    return [dataRows, headerRows];
  };

  const fetchFileData = useCallback(async () => {
    try {
      const response = await fetch(preUrl);
      const arrayBuffer = await response.arrayBuffer();
      const binaryString = new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      );

      const workbook = XLSX.read(binaryString, {
        type: "binary",
        cellStyles: true,
        cellHTML: true,
        cellFormula: true,
        cellText: true,
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const [rows, headings] = padHeaderRows(jsonData);

      setData([...headings, ...rows]);
    } catch (error) {
      console.error("Error fetching or processing the file:", error);
    }
  }, [preUrl]);

  useEffect(() => {
    if (
      preUrl &&
      mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      fetchFileData();
    }
  }, [preUrl, mimetype, fetchFileData]);

  const columns = data[0]
    ? Object.keys(data[0]).map((key) => ({
        name: key,
        header: key,
        editable: true,
      }))
    : [];

  const handleEditComplete = (editInfo) => {
    const { rowIndex, columnIndex, value } = editInfo;

    const updatedData = [...data];
    updatedData[rowIndex][columnIndex] = value;
    setData(updatedData);
    setIsEditing(true);
    setHasUnsavedChanges(true);
    resetIdleTimeout();
  };

  const handleUserActivity = (e) => {
    console.log("user is editing");
    if (e.key === "Enter") {
      saveFile();
    }

    setIsEditing(true);
    resetIdleTimeout();
  };

  const resetIdleTimeout = () => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = setTimeout(() => {
      setIsEditing(false);
      console.log("not editinh", hasUnsavedChanges);
      if (hasUnsavedChanges) {
        saveFile();
      }
    }, 1000);
  };

  const saveFile = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const fileBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([fileBuffer], { type: mimetype });
    console.log("Uploading ...");
    uploadFile(file)
      .then(() => {
        console.log("File saved successfully.");
        setHasUnsavedChanges(false);
      })
      .catch((error) => {
        console.error("File save error:", error);
      });
  };

  const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
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

  useEffect(() => {
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("mousedown", handleUserActivity);
    window.addEventListener("mousemove", handleUserActivity);

    return () => {
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  if (profileIsPending) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Please wait...</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll px-2">
      <div className="text-center py-2 bg-zinc-200 font-bold">
        <p>{fileName}</p>
        <div className="w-fit ml-auto px-2">
          <Button onClick={saveFile}>Save</Button>
        </div>
      </div>

      {data.length > 0 && (
        <ReactDataGrid
          dataSource={data}
          columns={columns}
          editable={true}
          style={{
            minHeight: 1000,
            border: "solid 1px #ccc",
            borderRadius: 4,
          }}
          columnMinWidth={120}
          columnDefaultWidth={200}
          onEditComplete={handleEditComplete}
          onEditValueChange={() => setHasUnsavedChanges(true)}
        />
      )}
    </div>
  );
};

export default SpreadsheetComponent;
