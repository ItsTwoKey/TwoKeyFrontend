import React, { useState } from "react";
import LeftArrowBlack from "../assets/leftArrowBlack.svg";
import Restart from "../assets/restart.svg";
import Copy from "../assets/copy.svg";
import AskAI from "../assets/askAi.svg";
import Assistant from "../assets/assistant.svg";
import Info from "../assets/info.svg";

let response = "Lorem ipsum dolor sit amet consectetur. ";

const AI = () => {
  const [message, setMessage] = useState("");

  const handleAskAiClick = () => {
    alert(message);
  };

  const handleCopyClick = () => {
    const textArea = document.createElement("textarea");
    textArea.value = response;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };

  return (
    <div className="flex ">
      <div className="w-1/6 ">
        <h2 className="text-center my-4 text-3xl font-semibold">TWOKEY</h2>
        <p className="px-4 py-6 font-semibold text-gray-800">Uploaded Files</p>
        <p className="py-2 px-4 mx-4 rounded-md text-sm font-semibold bg-[#F1F1FF]">
          product_1.pdf
        </p>
      </div>
      <div className="w-5/6 px-2 ">
        <div className="m-4 flex flex-row justify-start items-center">
          <img
            src={LeftArrowBlack}
            alt="←"
            //   onClick={handleBackButtonClick}
            className="cursor-pointer pt-1"
          />
          <p className="font-semibold ">product_1.pdf</p>
        </div>

        <div className="bg-[#F9F9F9] w-full rounded-[27px]">
          <span className="flex justify-end">
            <button className="bg-[#F1F1FF] my-6 mx-8 py-2 px-6 rounded-[21px] font-semibold shadow-xl flex gap-2 items-center">
              <img src={Restart} alt="." />
              Restart
            </button>
          </span>

          <div className="flex flex-col justify-between py-4 px-6 h-screen">
            <div className="w-full mx-2 p-4 rounded-[27px] bg-white">
              <span className="flex gap-2 my-2">
                <img src={Assistant} alt="AI" />
                <p className="text-sm font-semibold"> Summary</p>
              </span>

              <p className="text-sm">{response}</p>

              <span className="my-4 flex justify-between">
                <button className="">
                  <img src={Info} alt="i" />
                </button>
                <button onClick={handleCopyClick}>
                  <img src={Copy} alt="Copy" />
                </button>
              </span>
            </div>
            <span className="flex gap-4">
              <input
                type="text"
                placeholder="Send a message......."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full py-2 px-6 rounded-lg border border-black"
              />
              <button
                onClick={handleAskAiClick}
                type="submit"
                className="bg-[#A4A4A4] p-2 rounded-lg"
              >
                <img src={AskAI} alt="ask" />
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AI;
