import React, { useState, useEffect } from "react";

const SummarizeComponent: React.FC = () => {
  const [paragraph, setParagraph] = useState("");
  const [summary, setSummary] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const characterCount = paragraph.length > 1000 ? 1000 : paragraph.length;
 

  const handleRefresh = () => {
    window.location.reload();
  };

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

  const handleCopyText = () => {
    navigator.clipboard.writeText(summary);
    setIsCopied(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setParagraph(event.target.value);
    // setParagraph(paragraph.slice(0, 1000));
    const paragraph = event.target.value.slice(0, 1000);
    setParagraph(paragraph);
    setSummary("");
    setIsCopied(false);
  };

  return (
    <div className="flex w-full">
      <div className="grid h-50 flex-grow card bg-base-300 rounded-box">
        <div className="py-5 px-3">
          <label className="block">
            <span className="flex text-lg font-medium">
              Type/paste the text to be summarised
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-success shrink-0 w-6 h-6 ml-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </span>
          </label>

          <textarea
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            // onChange={handleChange}
            className="textarea textarea-success textarea-lg w-full max-w-3xl text-sm mt-6"
            placeholder="The fox and the owl were always Argumentative. They would often bicker about nonsense things until one day, the owl decided that it was enough. The owl flew up into the sky and declared that from now on, they would only argue when there was something worth arguing about."
            rows={5}
          />
          <p className="text-sm text-right text-gray-500">
            {characterCount}/1000
          </p>

          <div className="form-control mt-6">
            <button
              onClick={handleSummarize}
              disabled={!paragraph}
              className="btn btn-accent rounded-full text-base"
            >
              Generate
              {isLoading && <p className="loading loading-dots loading-sm"></p>}
            </button>
          </div>
        </div>
      </div>

      <div className="divider divider-horizontal"></div>
      <div className="grid h-auto flex-grow card bg-base-300 rounded-box">
        <div className="py-5 px-3">
          <label className="block">
            <span className="block text-xl font-medium">Results</span>
          </label>

          <div className="border border-success rounded-lg mt-6">
            {summary && <p className="py-5 px-4">{summary}</p>}
          </div>

          {summary && (
            <div className="form-control items-end mt-6">
              <div className="justify-end">
                <button
                  onClick={handleRefresh}
                  className="btn btn-accent rounded-full mr-2"
                >
                  Generate More
                </button>
                <button
                  onClick={handleCopyText}
                  className="btn btn-outline btn-accent rounded-full"
                >
                  {isCopied ? "Copied!" : "Copy"}
                  {/* Copy
                  {isCopied && <p className="text-success text-md">Copied!</p>} */}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummarizeComponent;
