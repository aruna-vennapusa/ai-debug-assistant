import express from "express";

const app = express();
const port = "8080";

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
