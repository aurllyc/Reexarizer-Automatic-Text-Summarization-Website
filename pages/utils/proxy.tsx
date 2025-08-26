import Replicate from "replicate";
import type { NextApiRequest, NextApiResponse } from "next";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const output = await replicate.run(
      "ibm-granite/granite-3.3-8b-instruct:latest",
      {
        input: {
          prompt,
          top_k: 50,
          top_p: 0.9,
          max_tokens: 2000,
          min_tokens: 0,
          temperature: 0.6,
          presence_penalty: 0,
          frequency_penalty: 0,
        },
      }
    );

    const resultText = Array.isArray(output) ? output.join("") : output;
    res.status(200).json({ result: resultText });
  } catch (error: any) {
    console.error("API error:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
