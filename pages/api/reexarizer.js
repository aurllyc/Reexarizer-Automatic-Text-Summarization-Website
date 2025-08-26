import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, style, summaryLength, language, keywords, customPrompt } =
    req.body;

  if (!text.trim()) {
    return res.status(400).json({ error: "Text input is required" });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const finalPrompt = `
      You are an AI summarizer.
      Strictly follow these rules:
- Output ONLY the summary of the given text.
- Do NOT add introductions, conclusions, emojis, or any content outside the summary.
- Do NOT include "Summary:" or any extra phrases.
- Do NOT change the language. Use ${language}.
- Summarize into ${
      style === "bullet" ? "clear bullet points" : "a clean paragraph"
    }.
- ${
      style === "bullet"
        ? 'Every point MUST start with "• " and nothing else.'
        : "Use well-structured sentences only."
    }.
- Maintain coherence and logical flow.
- Avoid redundant spaces and unnecessary words.
- Target length: around ${summaryLength} words.
- Keywords to emphasize: ${keywords.join(", ") || "none"}.
${customPrompt ? `Custom Instructions: ${customPrompt}` : ""}

=== TEXT ===
${text}
    `;

    const output = await replicate.run("ibm-granite/granite-3.3-8b-instruct", {
      input: {
        prompt: finalPrompt,
        top_k: 50,
        top_p: 0.9,
        max_tokens: 2000,
        min_tokens: 0,
        temperature: 0.6,
        presence_penalty: 0,
        frequency_penalty: 0,
      },
    });

    // Convert output to string
    let result = Array.isArray(output) ? output.join("") : String(output);

    result = result.replace(/\s+/g, " ").trim();

    // Bersihin header yang kadang ikut
    result = result
      .replace(/=== SUMMARY ===/gi, "")
      .replace(/summary\s*:/gi, "")
      .trim();

    if (style === "bullet") {
      result = result
        .split(/[\n\-•]/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => (line.startsWith("•") ? line : `• ${line}`)) // cuma tambahin kalo belum ada
        .join("\n");
    }

    res.status(200).json({ summary: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
}
