import type { NextApiRequest, NextApiResponse } from "next";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  try {
    const output = await replicate.run(
      "ibm-granite/granite-3.3-8b-instruct:latest",
      {
        input: {
          prompt,
          top_k: 50,
          top_p: 0.9,
          max_tokens: 2000,
          temperature: 0.6,
        },
      }
    );

    res.status(200).json({ result: output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
