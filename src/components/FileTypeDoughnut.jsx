import React, { useState, useEffect } from "react";
import { supabase } from "../helper/supabaseClient";
import Refresh from "../assets/refresh.svg";
import { Doughnut } from "react-chartjs-2";
import { scaleLinear } from "d3-scale";
import { Chart as ChartJS } from "chart.js/auto";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 2,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#A8C5DA" : "#3A36A1",
  },
}));

const fileTypes = [
  { type: "Documents", mimeType: "application/msword" },
  { type: "PDF", mimeType: "application/pdf" },
  { type: "PPT", mimeType: "application/vnd.ms-powerpoint" },
  { type: "XLS", mimeType: "application/vnd.ms-excel" },
  { type: "ZIP", mimeType: "application/zip" },
  { type: "JPG", mimeType: "image/jpeg" },
  // { type: "Other", icon: docIcon, mimeType: "other" },
];

const FileTypeDoughnut = () => {
  const [fileCounts, setFileCounts] = useState([]);

  useEffect(() => {
    async function fetchFiles() {
      const { data, error } = await supabase.storage.from("TwoKey").list();

      if (!error) {
        // Count files by type
        const fileTypeCounts = {};
        data.forEach((file) => {
          let mimeType = file.metadata.mimetype.toLowerCase();

          // Check if the MIME type contains keywords
          if (mimeType.includes(".document") || mimeType.includes(".word")) {
            mimeType = "application/msword";
          } else if (
            mimeType.includes("ppt") ||
            mimeType.includes("presentation") ||
            mimeType.includes("powerpoint")
          ) {
            mimeType = "application/vnd.ms-powerpoint";
          } else if (mimeType.includes("pdf")) {
            mimeType = "application/pdf";
          } else if (
            mimeType.includes("csv") ||
            mimeType.includes("xls") ||
            mimeType.includes("ods")
          ) {
            mimeType = "application/vnd.ms-excel";
          } else if (mimeType.includes("zip") || mimeType.includes("rar")) {
            mimeType = "application/zip";
          } else if (mimeType.includes("image/")) {
            mimeType = "image/jpeg";
          } else {
            mimeType = "other"; // Categorize as "Other" if not recognized
          }

          // Find the corresponding type in the fileTypes array
          const fileType =
            fileTypes.find((ft) => ft.mimeType === mimeType)?.type || "Other";

          fileTypeCounts[fileType] = (fileTypeCounts[fileType] || 0) + 1;
        });

        // Convert the object into an array of objects
        const fileTypeArray = Object.entries(fileTypeCounts).map(
          ([type, count]) => ({
            type,
            count,
          })
        );

        console.log("fileTypeArray", fileTypeArray);

        setFileCounts(fileTypeArray);
      }
    }

    fetchFiles();
  }, []);

  // Color scale
  const colorScale = scaleLinear()
    .domain([0, Math.max(...fileCounts.map((item) => item.count))])
    .range(["#C8C6FF", "#3A36A1"]);

  const getBackgroundColor = (count) => colorScale(count);

  const data = {
    labels: fileCounts.map((fileType) => fileType.type),
    datasets: [
      {
        label: "Analytics",
        data: fileCounts.map((fileType) => fileType.count),
        backgroundColor: fileCounts.map((fileType) =>
          colorScale(fileType.count)
        ),
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="">
      <span className="px-4 flex justify-between items-center">
        <p className="text-sm font-semibold">File type distribution</p>
        <button className="flex items-center gap-2">
          <img src={Refresh} alt="." />
          Refresh
        </button>
      </span>

      <hr className="border border-[#F6F6F6] mt-2" />
      <Doughnut
        className="p-3"
        data={data}
        options={{
          responsive: true,
          cutout: "60%",
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-4 font-semibold">
        {fileCounts.map((fileType, index) => (
          <span key={index}>
            <span
              className={`flex flex-row justify-between gap-2 text-xs ${
                index % 2 !== 0 && "justify-end"
              }`}
            >
              <p className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: getBackgroundColor(fileType.count) }}
                ></span>
                {fileType.type}
              </p>

              <p>{fileType.count}</p>
            </span>
            <BorderLinearProgress
              className="w-3/4 my-2"
              variant="determinate"
              value={80}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

export default FileTypeDoughnut;
