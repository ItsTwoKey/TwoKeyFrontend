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
import Skeleton from "@mui/material/Skeleton";
import Info from "../assets/info.svg";

const AIChat = ({ signedUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [fileText, setFileText] = useState("");
  const [error, setError] = useState(null);
  const [summarizedText, setSummarizedText] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFileText = async () => {
    try {
      const response = await fetch(signedUrl);
      const text = await response.text();
      setFileText(text);
      setError(null);
    } catch (error) {
      setFileText("");
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
      url: "https://open-ai21.p.rapidapi.com/summary",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "cd0c11c4b1msh85028df5f749931p19bd27jsnb65b743125e9",
        "X-RapidAPI-Host": "open-ai21.p.rapidapi.com",
      },
      data: {
        text: fileText,
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data.result);
      setMessages([...messages, { user: "Ai", text: response.data.result }]);
      setSummarizedText(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const askAi = async () => {
    // Add the user's question to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "Me", text: question },
    ]);
    setQuestion(""); // Clear the input field after asking the question

    const options = {
      method: "POST",
      url: "https://open-ai21.p.rapidapi.com/qa",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "cd0c11c4b1msh85028df5f749931p19bd27jsnb65b743125e9",
        "X-RapidAPI-Host": "open-ai21.p.rapidapi.com",
      },
      data: {
        question: question,
        context: fileText,
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);

      // Add the AI's response to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "Ai", text: response.data.result },
      ]);
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
    if (question.length) console.log(question);
    setMessages([...messages, { user: "Me", text: question }]);
    setQuestion("");
    console.log([...messages, { user: "Me", text: question }]);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(fileText);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setFileText("");
    setMessages([]);
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
          <div className="my-2 w-[486px]">
            <div className="flex flex-col justify-between py-4">
              {messages &&
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mx-2 my-2 flex flex-row gap-2 ${
                      message.user === "Me" ? " justify-end" : " justify-start"
                    }`}
                  >
                    <img
                      src={message.user === "Me" ? Assistant : AI}
                      alt={message.user}
                      className="w-[20px] h-[20px] mt-2"
                    />
                    <div
                      className={`px-4 py-3 rounded-xl max-w-[400px] text-gray-100 ${
                        message.user === "Me"
                          ? "bg-green-500 "
                          : "bg-violet-400 "
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
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
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full py-2 px-6 rounded-[8px] border border-black"
          />
          <button
            onClick={askAi}
            type="submit"
            className="bg-green-500 py-2 px-3 rounded-[8px] "
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
