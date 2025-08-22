import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faCheck,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

const Result: React.FC = () => {
  const [paragraph, setParagraph] = useState("");
  const [summary, setSummary] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hitung jumlah kata & kalimat
  const wordsCount = paragraph.trim()
    ? paragraph.trim().split(/\s+/).length
    : 0;
  const sentencesCount = paragraph.split(".").filter((s) => s.trim()).length;

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSummarize = () => {
    if (!paragraph) return;

    setIsLoading(true);

    setTimeout(() => {
      const sentences = paragraph.split(".");
      const summarizedText =
        (sentences?.[0] || "").slice(0, 1000) +
        (sentences?.[0]?.length > 1000 ? "..." : "");
      setSummary(summarizedText);
      setIsLoading(false);
    }, 2000);
  };

  const handleCopyText = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setIsCopied(true);
  };

  return (
    <div className="flex-col items-center justify-between py-5 px-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xl font-medium">Results</span>
      </div>

      {/* Hasil Summary */}
      {/* {summary && ( */}
      <textarea
        className="textarea textarea-success w-full text-sm mt-6 rounded-lg resize-none"
        rows={5}
        value={summary}
        readOnly
      />
      {/* )} */}

      {/* Footer Info & Actions */}
      {/* {summary && ( */}
      <div className="flex items-center gap-4 justify-between mt-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <p className="text-sm sm:text-md font-medium">
            {sentencesCount} Sentences
          </p>
          <p className="text-sm sm:text-md font-medium">{wordsCount} Words</p>
        </div>
        <div className="flex  items-end gap-2">
          <button
            onClick={handleRefresh}
            className="btn btn-xs sm:btn-sm btn-error btn-circle "
          >
            <FontAwesomeIcon icon={faTrashCan} className="text-md" />
          </button>

          <button className="btn btn-xs sm:btn-sm btn-outline btn-success btn-circle">
            <FontAwesomeIcon icon={faDownload} className="text-md" />
          </button>

          <button
            onClick={handleCopyText}
            className={`btn btn-xs sm:btn-sm btn-outline btn-success btn-circle ${
              isCopied ? "btn-success" : ""
            }`}
          >
            <FontAwesomeIcon
              icon={isCopied ? faCheck : faCopy}
              className="text-md"
            />
          </button>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default Result;
