import express from "express";
import cors from "cors";

const app = express();
const port = "8080";

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
  res.send({ ok: true });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
