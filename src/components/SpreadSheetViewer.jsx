import React, { useState, useEffect, useCallback } from "react";
import "@inovua/reactdatagrid-community/index.css";
import "@inovua/reactdatagrid-community/theme/default-light.css";
import ReactDataGrid from "@inovua/reactdatagrid-community";

import * as XLSX from "xlsx-js-style";

const SpreadsheetComponent = ({ preUrl, mimetype, fileName }) => {
  const [data, setData] = useState([]);

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
  };

  return (
    <div className="h-screen overflow-y-scroll px-2">
      <div className="text-center py-2 bg-zinc-200 font-bold">{fileName}</div>
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
        />
      )}
    </div>
  );
};

export default SpreadsheetComponent;
