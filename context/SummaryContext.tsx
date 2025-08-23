import React, { createContext, useContext, useState } from "react";
import Replicate from "replicate"; 

// ---- Context Types ----
type Language = "english" | "indonesia";
type Style = "paragraph" | "bullet";

interface SummaryContextType {
  inputText: string;
  language: Language;
  style: Style;
  summaryLength: number;
  keywords: string[];
  loading: boolean;
  summary: string;
  history: { text: string; summary: string; metadata: any }[];
  customPrompt: string;
  setInputText: (text: string) => void;
  setLanguage: (lang: Language) => void;
  setStyle: (style: Style) => void;
  setSummaryLength: (length: number) => void;
  setKeywords: (keywords: string[]) => void;
  setLoading: (loading: boolean) => void;
  setSummary: (summ: string) => void;
  setHistory: (
    hist: { text: string; summary: string; metadata: any }[]
  ) => void;
  setCustomPrompt: (prompt: string) => void;
  clearHistory: () => void;
  generateSummary: () => Promise<void>;
}

// ---- Context Init ----
const SummaryContext = createContext<SummaryContextType | undefined>(undefined);

// ---- Provider ----
export const SummaryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [inputText, setInputText] = useState("");
  const [language, setLanguage] = useState<Language>("english");
  const [style, setStyle] = useState<Style>("paragraph");
  const [summaryLength, setSummaryLength] = useState(50);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [history, setHistory] = useState<
    { text: string; summary: string; metadata: any }[]
  >([]);

  // Replicate Client
  const replicate = new Replicate({
    auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN as string, // simpen di .env.local
  });

  // ---- Generate Summary ----
  const generateSummary = async () => {
    if (!inputText) return;
    setLoading(true);

    try {
      const res = await fetch("/api/reexarizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputText,
          style,
          summaryLength,
          language,
          keywords,
          customPrompt,
        }),
      });

      const data = await res.json();

      setSummary(data.summary);
      setHistory((prev) => [
        ...prev,
        {
          text: inputText,
          summary: data.summary,
          metadata: { style, summaryLength, keywords, language, customPrompt },
        },
      ]);
    } catch (err) {
      console.error("Error generating summary:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---- Clear History ----
  const clearHistory = () => setHistory([]);

  return (
    <SummaryContext.Provider
      value={{
        inputText,
        language,
        style,
        summaryLength,
        keywords,
        loading,
        summary,
        history,
        customPrompt,
        setInputText,
        setLanguage,
        setStyle,
        setSummaryLength,
        setKeywords,
        setLoading,
        setSummary,
        setHistory,
        setCustomPrompt,
        clearHistory,
        generateSummary,
      }}
    >
      {children}
    </SummaryContext.Provider>
  );
};

// ---- Hook ----
export const useSummary = () => {
  const context = useContext(SummaryContext);
  if (!context)
    throw new Error("useSummary must be used within SummaryProvider");
  return context;
};
