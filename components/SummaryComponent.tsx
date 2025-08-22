import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDotCircle, faPaste } from "@fortawesome/free-solid-svg-icons";

const SummarizeComponent: React.FC = () => {
  const [paragraph, setParagraph] = useState("");
  const [summary, setSummary] = useState("");
  const [isPaste, setIsPaste] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("paragraph, bullet, custom");

  const wordsCount = paragraph.trim()
    ? paragraph.trim().split(/\s+/).length
    : 0;

  const handleSummarize = () => {
    if (!paragraph) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const sentences = paragraph.split(".");
      const summarizedText =
        (sentences?.[0] || "").slice(0, 1000) +
        (sentences?.[0]?.length > 1000 ? "..." : "");
      setSummary(summarizedText);
      setIsLoading(false);
    }, 2000); // (2 seconds)
  };

  // Paste Text
  const handlePasteText = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        setParagraph(text.slice(0));
        setSummary("");
        setIsPaste(true);
      })
      .catch((err) => {
        console.error("Failed to paste text: ", err);
      });
  };

  // Doc

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value.slice(0);
    setParagraph(value);
    setSummary("");
    setIsPaste(false);
  };

  return (
    <div className="flex-col items-center justify-between py-5 px-3">
      <label className="flex items-center justify-between space-x-1">
        <span className="flex text-lg font-medium">
          Type/paste the text to be summarised
        </span>
        <select className="select select-xs sm:select-sm select-success">
          <option value="id">🇮🇩 Indo</option>
          <option value="en">🇺🇸 Eng</option>
        </select>
      </label>

      <div className="flex items-center space-x-2 my-2 bg-base-200 p-2 rounded-lg">
        <div className="flex-col space-y-2">
          <span className="text-md font-medium">Modes:</span>
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`badge badge-outline cursor-pointer font-medium text-sm ${
                mode === "paragraph"
                  ? "badge-info text-base-300"
                  : "hover:bg-info hover:text-base-300"
              }`}
              onClick={() => setMode("paragraph")}
            >
              Paragraph
            </div>

            <div
              className={`badge badge-outline cursor-pointer font-medium text-sm ${
                mode === "bullet"
                  ? "badge-accent text-base-300"
                  : "hover:bg-accent hover:text-base-300"
              }`}
              onClick={() => setMode("bullet")}
            >
              Bullet
            </div>

            <div
              className={`badge badge-outline cursor-pointer font-medium text-sm ${
                mode === "custom"
                  ? "badge-secondary text-base-300"
                  : "hover:bg-secondary hover:text-base-300"
              }`}
              onClick={() => setMode("custom")}
            >
              Custom
            </div>
          </div>
        </div>
        <div className="divider divider-horizontal"></div>

        <div className="flex-col space-y-2">
          <span className="text-md font-medium">Summary Length:</span>
          <div className="w-full max-w-xs">
            <div className="flex flex-col sm:flex-row items-start s:items-center gap-2">
              <span className="hidden sm:inline">Short</span>
              <div className="">
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={50}
                  step={25}
                  className="range range-xs range-success"
                />

                <div className="flex justify-between text-xs">
                  <span>
                    <FontAwesomeIcon icon={faDotCircle} className="text-md" />
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faDotCircle} className="text-md" />
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faDotCircle} className="text-md" />
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faDotCircle} className="text-md" />
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faDotCircle} className="text-md" />
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline">Long</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <textarea
          value={paragraph}
          onChange={handleChange}
          className="textarea textarea-success w-full text-sm mt-4 rounded-lg resize-none"
          placeholder="Type or paste your text here..."
          rows={5}
        />

        <div className="flex justify-between gap-2">
          <input
            type="file"
            className="flex w-full max-w-sm file-input file-input-sm file-input-success"
          />
          <button
            type="button"
            onClick={handlePasteText}
            className="btn btn-sm btn-outline btn-success"
          >
            <FontAwesomeIcon icon={faPaste} className="text-lg" />
          </button>
        </div>
      </div>
      <p className="flex text-md font-medium mt-12 items-start justify-start">
        {wordsCount} Words
      </p>

      <div className="flex flex-col space-y-2 mt-4">
        <label className="text-md font-medium">Select Keywords:</label>
        <ul className="list-none space-y-3">
          {[1, 2].map((id) => (
            <li
              key={id}
              className="flex items-center justify-between bg-base-200 p-3 rounded-lg"
            >
              <div
                className={`badge badge-outline cursor-pointer font-medium text-sm ${
                  mode === ""
                    ? "badge-secondary text-base-300"
                    : "hover:bg-secondary hover:text-base-300"
                }`}
                onClick={() => setMode("")}
              >
                Keyword {id}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-control mt-2">
        <button
          onClick={handleSummarize}
          disabled={!paragraph}
          className="btn btn-accent rounded-full text-base"
        >
          {isLoading ? (
            <p className="loading loading-dots loading-sm"></p>
          ) : summary ? (
            "RE-SUMMARIZE"
          ) : (
            "SUMMARIZE"
          )}
        </button>
      </div>
    </div>
  );
};

export default SummarizeComponent;
