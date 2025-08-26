"use client";

import React, { useState, useEffect } from "react";
import * as mammoth from "mammoth";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faDownload,
  faPaste,
  faCircleInfo,
  faDotCircle,
  faRedo,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

// --- Types ---
interface HistoryItem {
  id: string;
  original: string;
  summary: string;
  timestamp: number;
}

type Language = "english" | "indonesia";

// --- Utility Functions ---
// Simple keyword detection for Paragraph mode
const extractKeywords = (text: string, limit: number = 10) => {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)
    .filter(Boolean);
  const freq: Record<string, number> = {};
  words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => ({ word, active: true }));
  return sorted;
};

// --- Component ---
const Summarize: React.FC = () => {
  // --- States ---
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"Paragraph" | "Bullet" | "Custom">(
    "Paragraph"
  );
  const [copied, setCopied] = useState(false);
  const [length, setLength] = useState(50);
  const [keywords, setKeywords] = useState<{ word: string; active: boolean }[]>(
    []
  );
  const [customPrompt, setCustomPrompt] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(
    null
  );
  const [language, setLanguage] = useState<Language>("english");

  const formatSummary = (text: string) => {
    let cleaned = text
      .replace(/\s+/g, " ")
      .replace(/\r?\n|\r/g, "\n")
      .trim();
    return cleaned;
  };

  // --- Load & Save history ---
  useEffect(() => {
    const stored = localStorage.getItem("summaryHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("summaryHistory", JSON.stringify(history));
  }, [history]);

  // --- Handlers ---
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (mode === "Paragraph") {
      setKeywords(extractKeywords(e.target.value));
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        setText(result.value);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handlePaste = async () => {
    const clipboard = await navigator.clipboard.readText();
    setText((prev) => prev + "\n" + clipboard);
    if (mode === "Paragraph") {
      setKeywords(extractKeywords(clipboard));
    }
  };

  const handleKeywordToggle = (word: string) => {
    setKeywords((prev) =>
      prev.map((k) => (k.word === word ? { ...k, active: !k.active } : k))
    );
  };

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reexarizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          style:
            mode === "Paragraph"
              ? "paragraph"
              : mode === "Bullet"
              ? "bullet"
              : "paragraph",
          summaryLength: length,
          language,
          keywords: keywords.filter((k) => k.active).map((k) => k.word),
          customPrompt: mode === "Custom" ? customPrompt : "",
        }),
      });

      const data = await res.json();

      let finalSummary = data.summary;
      if (mode === "Bullet") {
        finalSummary = formatSummary(finalSummary);
      } else {
        finalSummary = finalSummary.replace(/\s+/g, " ").trim();
      }

      setSummary(finalSummary);

      const newHistory: HistoryItem = {
        id: Date.now().toString(),
        original: text,
        summary: finalSummary,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newHistory, ...prev].slice(0, 10));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    saveAs(blob, filename);
  };

  const handleDeleteHistory = (id: string) =>
    setHistory((prev) => prev.filter((item) => item.id !== id));

  const handleClearHistory = () => setHistory([]);

  const wordTextCount = text.split(/\s+/).filter(Boolean).length;
  const wordCount = summary.split(/\s+/).filter(Boolean).length;
  const sentenceCount = summary.split(/[.!?]/).filter(Boolean).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* Summary */}
      <div className="card rounded-box bg-base-300">
        <div className="flex-col items-center justify-between py-5 px-3">
          <div className="flex items-center justify-between space-x-1">
            <span className="text-xl font-medium">
              Type/paste the text to be summarised
            </span>
            <select
              className="select select-xs sm:select-sm select-success"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value="english">🇺🇸 Eng</option>
              <option value="indonesia">🇮🇩 Indo</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 my-2 bg-base-200 p-2 rounded-lg">
            <div className="flex-col space-y-2">
              <span className="text-md font-medium">Modes:</span>
              <div className="flex flex-wrap items-center gap-2">
                {["Paragraph", "Bullet", "Custom"].map((m) => (
                  <span
                    key={m}
                    className={`badge cursor-pointer ${
                      mode === m ? "badge-primary" : "badge-outline"
                    }`}
                    onClick={() => setMode(m as any)}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex-col space-y-2">
              <p className="text-md font-medium">Summary Length:</p>{" "}
              <span className="text-md font-medium">{length}%</span>
              <div className="w-full max-w-xs">
                <div className="">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={25}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="range range-xs range-success"
                  />

                  {/* dot */}
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
              </div>
            </div>{" "}
          </div>

          <div className="flex flex-col space-y-2">
            <textarea
              className="textarea textarea-success w-full text-sm mt-4 rounded-lg resize-none"
              placeholder="Paste, type, or upload doc/docx text here..."
              rows={5}
              value={text}
              onChange={handleTextChange}
            />
            <div className="flex justify-between gap-2">
              <input
                type="file"
                accept=".txt,.doc,.docx"
                onChange={handleFileUpload}
                className="flex w-full max-w-sm file-input file-input-sm file-input-success"
              />
              <button
                onClick={handlePaste}
                className="btn btn-sm btn-outline btn-success"
              >
                <FontAwesomeIcon icon={faPaste} className="text-lg" />
              </button>
            </div>{" "}
          </div>
          <p className="flex text-md font-medium mt-16 items-start justify-start">
            {wordTextCount} Words
          </p>
          <div className="flex-col items-center space-x-2 mb-4 bg-base-200 p-2 rounded-lg">
            {mode === "Custom" && (
              <div className="flex-col items-center space-x-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <label className="text-md font-medium">
                      Tailor your summary by entering instructions
                    </label>
                    <div className="dropdown">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-circle btn-ghost btn-xs text-info"
                      >
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          className="text-md"
                        />
                      </div>
                      <div
                        tabIndex={0}
                        className="card card-sm dropdown-content bg-base-100 rounded-box z-10 w-64 shadow-sm"
                      >
                        <div className="py-2 px-4">
                          <p>Describe how you want your text summarized</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trash */}
                  <div className="flex items-center space-x-0">
                    <button
                      type="button"
                      className="btn btn-xs sm:btn-sm btn-circle btn-error"
                      onClick={() => setCustomPrompt("")}
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="text-md" />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="input input-sm mt-4 input-success w-full"
                  placeholder="Make it Academic"
                />
              </div>
            )}

            {/* Mode Paragraph */}
            {mode === "Paragraph" && keywords.length > 0 && (
              <div className="flex-col items-center space-x-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <label className="text-md font-medium">
                      Select Keywords
                    </label>
                    <div className="dropdown">
                      <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-circle btn-ghost btn-xs text-info"
                      >
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          className="text-md"
                        />
                      </div>
                      <div
                        tabIndex={0}
                        className="card card-sm dropdown-content bg-base-100 rounded-box z-10 w-64 shadow-sm"
                      >
                        <div className="py-2 px-4">
                          <p>Pick keywords to focus the summary.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trash */}
                  <div className="flex items-center space-x-0">
                    <button
                      type="button"
                      className="btn btn-xs sm:btn-sm btn-circle btn-error"
                      onClick={() => setKeywords([])}
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="text-md" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw) => (
                    <span
                      key={kw.word}
                      className={`badge cursor-pointer ${
                        kw.active ? "badge-outline" : "badge-secondary"
                      }`}
                      onClick={() => handleKeywordToggle(kw.word)}
                    >
                      {kw.word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex mt-2 space-x-2">
            <button
              className="flex-1 btn btn-accent text-base"
              onClick={handleSummarize}
              disabled={loading}
            >
              {loading ? (
                <p className="loading loading-dots loading-sm"></p>
              ) : (
                "Summarize"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="card bg-base-300 rounded-box h-50">
        <div className="flex-col items-center justify-between py-5 px-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">Summary Result</h2>
          </div>
          <div className="flex w-full mt-6 rounded-lg border border-success p-4 min-h-[150px]">
            <p className="text-sm ">{summary}</p>
          </div>

          <div className="flex items-center gap-4 justify-between mt-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <p className="text-sm sm:text-md font-medium">
                {sentenceCount} Sentences
              </p>
              <p className="text-sm sm:text-md font-medium">
                {wordCount} Words
              </p>
            </div>
            <div className="flex  items-end gap-2">
              <button
                className="btn btn-xs sm:btn-sm btn-error btn-circle "
                onClick={() => {
                  setSummary("");
                  setText("");
                  setKeywords([]);
                  setCustomPrompt("");
                }}
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-md" />
              </button>

              <button
                className="btn btn-xs sm:btn-sm btn-outline btn-success btn-circle"
                onClick={() => handleDownload(summary, "summary.txt")}
              >
                <FontAwesomeIcon icon={faDownload} className="text-md" />
              </button>

              <button
                className="btn btn-xs sm:btn-sm btn-outline btn-success btn-circle"
                onClick={() => handleCopy(summary)}
              >
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  className="text-md"
                />{" "}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="md:col-span-2 card bg-base-300 rounded-box h-50">
        <div className="flex-col items-center justify-between py-5 px-3">
          <div className="flex items-center justify-between">
            <p className="text-xl font-medium">
              History <span className="text-success ">(Last 10)</span>
            </p>
            {history.length > 0 && (
              <button
                className="btn btn-sm btn-outline btn-error"
                onClick={() =>
                  (
                    document.getElementById(
                      "clearAllModal"
                    ) as HTMLDialogElement
                  ).showModal()
                }
              >
                Clear All
              </button>
            )}
          </div>

          {/* Clear All Modal */}
          <dialog id="clearAllModal" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
                <h3 className="font-bold text-lg">Confirm Deletion</h3>
                <p className="py-4">
                  Are you sure you want to delete all history? This action
                  cannot be undone.
                </p>

                <div className="modal-action">
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={handleClearHistory}
                  >
                    Delete All
                  </button>
                  <button className="btn btn-sm">Cancel</button>
                </div>
              </form>
            </div>
          </dialog>

          <p className="text-sm text-gray-500">
            {history.length} {history.length === 1 ? "item" : "items"} found
          </p>

          {/* History List */}
          <div className="mt-6">
            <div className="space-y-3">
              {history.length === 0 && (
                <p className="flex w-full items-center justify-center text-md font-medium">
                  No history yet.
                </p>
              )}
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between space-x-6 items-center p-2 bg-base-100 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-4xl font-thin tabular-nums">
                      {history.length - history.indexOf(item)}
                    </div>
                    <p className="text-sm">
                      {item.original.length > 80
                        ? item.original.slice(0, 80) + "..."
                        : item.original}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                    <button
                      className="btn btn-xs sm:btn-sm btn-outline btn-info"
                      onClick={() => setSelectedHistory(item)}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleCopy(item.summary)}
                      className="btn btn-xs sm:btn-sm btn-outline btn-primary"
                    >
                      <FontAwesomeIcon icon={faCopy} className="text-sm" />
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(item.summary, `summary_${item.id}.txt`)
                      }
                      className="btn btn-xs sm:btn-sm btn-outline btn-success"
                    >
                      <FontAwesomeIcon icon={faDownload} className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteHistory(item.id)}
                      className="btn btn-xs sm:btn-sm btn-outline btn-error"
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for History Details */}
      {selectedHistory && (
        <div className="modal modal-open">
          <div className="modal-box w-full max-w-4xl mx-4">
            <form method="dialog">
              <button
                onClick={() => setSelectedHistory(null)}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </button>
              <h3 className="font-bold text-success text-lg mb-4">
                History Detail
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <h4 className="font-semibold mt-2">Original Text:</h4>
                  <textarea
                    readOnly
                    className="textarea w-full h-60 bg-base-300 resize-none"
                    value={selectedHistory.original}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <h4 className="font-semibold mt-2">Summary:</h4>
                  <textarea
                    readOnly
                    className="textarea bg-base-300 w-full h-60 resize-none"
                    value={selectedHistory.summary}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summarize;
