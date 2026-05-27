import { useState } from "react";
import type { AnalyzeResponse, AnalyzeRequest } from "../types/api";
import { analyzeError } from "../services/apiClient";
import "../styles/AnalyzeError.css";

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
      const data = await analyzeError(payload);
      setResult(data);
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
    <section className="analyze-container">
      <div className="analyze-card">
        <h2>Analyze Error</h2>
        <div className="form-group">
          <label>Error message</label>
          <textarea
            placeholder="TypeError: Cannot read properties of undefined (reading 'map')"
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Code snippet</label>
          <textarea
            placeholder="Paste related code here..."
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
          />
        </div>
        <button
          disabled={loading || errorMessage.trim() === ""}
          onClick={handleAnalyze}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
        {error && <p className="error-message">{error}</p>}
        {result && (
          <div className="result-card">
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
            <div className="code-section">
              <h4>Suggested Code</h4>
              {result?.suggestedCode && (
                <div>
                  <button
                    disabled={copied}
                    onClick={() => {
                      handleCopy(result.suggestedCode!);
                    }}
                  >
                    {!copied ? "Copy Code" : "Copied!"}
                  </button>
                  <pre className="code-block">{result.suggestedCode}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AnalyzeError;
