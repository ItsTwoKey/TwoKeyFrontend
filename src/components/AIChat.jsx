import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AI from "../assets/ai.svg";
import axios from "axios";
import Restart from "../assets/restart.svg";
import Copy from "../assets/copy.svg";
import AskAI from "../assets/askAi.svg";
import Assistant from "../assets/assistant.svg";
import Info from "../assets/info.svg";
import * as pdfjs from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker";

const AIChat = ({ signedUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [fileText, setFileText] = useState("");
  const [error, setError] = useState(null);
  const [summarizedText, setSummarizedText] = useState("");

  const fetchFileText = async () => {
    try {
      const response = await fetch(signedUrl);
      const contentType = response.headers.get("content-type");
      if (contentType === "application/pdf") {
        const pdfData = new Uint8Array(await response.arrayBuffer());
        const loadingTask = pdfjs.getDocument(pdfData);
        const pdfDocument = await loadingTask.promise;
        let extractedText = "";
        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          extractedText += pageText + " ";
        }
        setFileText(extractedText.trim());
      } else if (contentType === "text/plain" || contentType === "text/csv") {
        setFileText(await response.text());
      } else {
        setError("Unsupported file format");
      }
    } catch (error) {
      setError("Error fetching file. Please check the URL and try again.");
    }
  };

  useEffect(() => {
    if (signedUrl) {
      fetchFileText();
    }
  }, [signedUrl]);

  const fetchSummarizedData = async () => {
    console.log("Fetching summarized data...");

    const options = {
      method: "POST",
      url: "https://text-analysis12.p.rapidapi.com/summarize-text/api/v1.1",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "4170d6fec5msh4817aca35c9333ap1cae79jsnc7d7a464dda6",
        "X-RapidAPI-Host": "text-analysis12.p.rapidapi.com",
      },
      data: {
        language: "english",
        summary_percent: 25,
        text: fileText,
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      setSummarizedText(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (fileText.length) {
      fetchSummarizedData();
    }
  }, [fileText]);

  const handleAskAiClick = () => {
    // alert(message);
    if (message.length) console.log(message);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(fileText);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <div className="">
      <button
        onClick={openDialog}
        className="h-12 w-12 shadow-lg border border-gray-500 bg-[#3C4042] rounded-full"
      >
        <img src={AI} alt="AI" className="mx-auto" />
      </button>

      <Dialog
        open={isOpen}
        onClose={closeDialog}
        PaperProps={{
          style: {
            borderRadius: "22px",
            position: "absolute",
            bottom: "0px",
            right: "0px",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#F9F9F9",
          }}
        >
          <div className="flex justify-between items-center">
            <button className="flex justify-center items-center gap-1 text-sm font-semibold rounded-full bg-[#F1F1FF] px-4 py-2 shadow-xl">
              <img className="w-4 h-4" src={Restart} alt="." />
              Restart
            </button>
            <button
              className="flex justify-center items-center bg-black text-white rounded-full px-[6px] py-[2px] text-xs"
              onClick={closeDialog}
            >
              X
            </button>
          </div>
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "#F7F8FA",
          }}
        >
          <div className="my-2 w-[486px] ">
            <div className="flex flex-col justify-between py-4 ">
              <div className="w-full mx-2 p-4 rounded-[27px] bg-white shadow-lg">
                <span className="flex gap-2 my-2">
                  <img src={Assistant} alt="AI" />
                  <p className="text-sm font-semibold"> Summary</p>
                </span>

                {summarizedText ? (
                  <p className="text-sm">{summarizedText.summary}</p>
                ) : (
                  <p className="text-sm">Summarized text is not available.</p>
                )}

                <span className="my-4 flex justify-between">
                  <button className="">
                    <img src={Info} alt="i" />
                  </button>
                  <button onClick={handleCopyToClipboard}>
                    <img src={Copy} alt="Copy" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "15px",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#F9F9F9",
          }}
        >
          {/* <span className="flex justify-center items-center gap-4 "> */}
          <input
            type="text"
            placeholder="Send a message......."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full py-2 px-6 rounded-[8px] border border-black"
          />
          <button
            onClick={handleAskAiClick}
            type="submit"
            className="bg-[#A4A4A4] p-2 rounded-[8px] "
          >
            <img src={AskAI} alt="ask" />
          </button>
          {/* </span> */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AIChat;
