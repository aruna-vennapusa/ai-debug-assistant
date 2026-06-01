import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";

const app = express();
const port = 8080;

const mockAnalyzeResponse = {
  meaning:
    "This error happens when you try to call the map method on a value that is undefined.",
  likelyCauses: [
    "The variable is undefined.",
    "API data has not loaded yet.",
    "State was not initialized properly.",
  ],
  fixSteps: [
    "Initialize state with an empty array.",
    "Check data before rendering.",
    "Use optional chaining where appropriate.",
  ],
  suggestedCode: "const [items, setItems] = useState([]);",
};

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/analyze", async (req, res) => {
  const { errorMessage, codeSnippet } = req.body ?? {};

  if (typeof errorMessage !== "string" || errorMessage.trim() === "") {
    return res.status(400).json({
      error: "ErrorMessage must be a non-empty string",
    });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI debugging assistant. Return only valid JSON. Do not include markdown or explanation outside JSON.",
        },
        {
          role: "user",
          content: `
Analyze this developer error.

Error message:
${errorMessage}

Code snippet:
${codeSnippet || "No code snippet provided"}

Return JSON exactly in this shape:
{
  "meaning": "simple explanation",
  "likelyCauses": ["cause 1", "cause 2"],
  "fixSteps": ["step 1", "step 2"],
  "suggestedCode": "optional improved code snippet"
}
        `,
        },
      ],
    });

    const aiText = completion.choices[0]?.message?.content;

    if (!aiText) {
      return res.json(mockAnalyzeResponse);
    }

    const parsedResponse = JSON.parse(aiText);

    return res.json(parsedResponse);
  } catch (err) {
    console.error("AI analyze failed:", err);

    return res.json(mockAnalyzeResponse);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
