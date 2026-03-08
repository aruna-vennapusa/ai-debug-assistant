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
  const { errorMessage, codeSnippet } = req.body ?? {};

  if (typeof errorMessage !== "string" || errorMessage.trim() === "") {
    return res.status(400).json({
      error: "ErrorMessage must be a non-empty string",
    });
  }
  res.json({
    meaning:
      "This error happens when you try to call the 'map' method on a value that is undefined. In JavaScript, only arrays have the 'map' method, so if the variable is undefined or null, the operation will fail.",
    likelyCauses: [
      "The variable you are calling map() on has not been initialized yet.",
      "Data from an API request has not loaded before rendering the component.",
      "The state variable is initially undefined instead of an empty array.",
    ],
    fixSteps: [
      "Ensure the variable you are calling map() on is an array before rendering.",
      "Initialize state variables with an empty array instead of undefined.",
      "Add conditional rendering to avoid calling map() before the data is available.",
    ],
    suggestedCode:
      "const [items, setItems] = useState([]);\n\nreturn (\n  <div>\n    {items.map(item => (\n      <p key={item.id}>{item.name}</p>\n    ))}\n  </div>\n);",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
