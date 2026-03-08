import { useState } from "react";
import type { AnalyzeResponse, AnalyzeRequest } from "../types/api";
import axios from "axios";

function AnalyzeError() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [codeSnippet, setCodeSnippet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    const payload: AnalyzeRequest = {
      errorMessage,
      codeSnippet,
    };

    try {
      const response = await axios.post<AnalyzeResponse>(
        "/api/analyze",
        payload,
      );
      setResult(response.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Analyze Error</h2>
      <label>Error message</label>
      <textarea
        placeholder="TypeError: Cannot read properties of undefined (reading 'map')"
        value={errorMessage}
        onChange={(e) => setErrorMessage(e.target.value)}
      />
      <label>Code snippet</label>
      <textarea
        placeholder="Paste related code here..."
        value={codeSnippet}
        onChange={(e) => setCodeSnippet(e.target.value)}
      />
      <button
        disabled={loading || errorMessage.trim() === ""}
        onClick={handleAnalyze}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}

export default AnalyzeError;
