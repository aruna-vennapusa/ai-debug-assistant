import { useState } from "react";
import type { AnalyzeResponse, AnalyzeRequest } from "../types/api";
import axios from "axios";

function AnalyzeError() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [codeSnippet, setCodeSnippet] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);
    setCopied(false);
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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
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
      {result && (
        <div>
          <h3>Analysis Result</h3>
          <h4>Meaning</h4>
          <p>{result.meaning}</p>
          <h4>Likely Causes</h4>
          <ul>
            {result.likelyCauses.map((cause, index) => (
              <li key={index}>{cause}</li>
            ))}
          </ul>
          <h4>Fix Steps</h4>
          <ol>
            {result.fixSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          <h4>Suggested Code</h4>
          {result?.suggestedCode && (
            <div>
              <button
                disabled={copied}
                onClick={() => {
                  handleCopy(result.suggestedCode!);
                }}
              >
                {!copied ? "Copy Code..." : "Copied!"}
              </button>
              <pre>{result.suggestedCode}</pre>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default AnalyzeError;
