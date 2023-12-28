import React, { useState, useEffect } from "react";
import axios from "axios";
import LeftArrowBlack from "../assets/leftArrowBlack.svg";
import Restart from "../assets/restart.svg";
import Copy from "../assets/copy.svg";
import AskAI from "../assets/askAi.svg";
import Assistant from "../assets/assistant.svg";
import Info from "../assets/info.svg";

const AI = () => {
  const [message, setMessage] = useState("");
  const [summarizedText, setSummarizedText] = useState({});

  const fetchData = async () => {
    const options = {
      method: "POST",
      url: "https://article-extractor-and-summarizer.p.rapidapi.com/summarize-text",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "4170d6fec5msh4817aca35c9333ap1cae79jsnc7d7a464dda6",
        "X-RapidAPI-Host": "article-extractor-and-summarizer.p.rapidapi.com",
      },
      data: {
        lang: "en",
        text: "##The problem Let's ask ChatGPT to summarize a fresh piece of news:GPT hallucinates. But it is not apparent.This looks pretty legitimate, isn't it? GPT gives a summary for existing links and detects broken links, which apparently means there is a web scraper underneath, woah! Of course not. GPT is just smart. The biggest issue here is that it is not even obvious for the user that this is a pure fantasy of GPT, so I was pretty sure GPT is able to get the new content from the web until I have started doing real and thorough fact checking of the summary it produced.TLDR: if you feed the URL of a random article into GPT, and ask it to summarize, using \"please summarize <url>\" prompt, it hallucinates by just analyzing words in the URL – it does NOT get the actual content of an article (Ok, this is true for the end of March of 2023, I am pretty sure this might change soon with OpenAI plugins).As you can see on this screenshot above, GPT not only hallucinates, it is also smart enough to gaslight the user when the user tries to check how it behaves on a non-existing URL! GPT leverages context knowledge from the chat to understand that the second URL is looking bad.But how do I know?",
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
    fetchData();
  }, []);

  const handleAskAiClick = () => {
    alert(message);
  };

  const handleCopyClick = () => {
    const textArea = document.createElement("textarea");
    textArea.value = summarizedText.summary;
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

              <p className="text-sm">{summarizedText.summary}</p>

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
