import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  const { prompt } = req.body;

  try {
    const output = await replicate.run(
      "ibm-granite/granite-3.3-8b-instruct:3ff9e6e20ff1f31263bf4f36c242bd9be1acb2025122daeefe2b06e883df0996",
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

    res.status(200).json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to summarize" });
  }
}
