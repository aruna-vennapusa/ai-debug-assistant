import express from "express";
import cors from "cors";

const app = express();
const port = 8080;

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/analyze", (req, res) => {
  const { errorMessage } = req.body;

  if (!errorMessage) {
    return res.status(400).json({
      error: "Error Message is not valid",
    });
  }
  res.json({ meaning: "", likelyCauses: [], fixSteps: [], suggestedCode: "" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
