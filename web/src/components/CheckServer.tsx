import { useState } from "react";
import axios from "axios";
import type { HealthResponse } from "../types/api";

function CheckServer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleClick = async () => {
    try {
      setError(null);
      setResult(null);
      setLoading(true);
      const response = await axios.get<HealthResponse>("/health");
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
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Checking..." : "Check Server"}
      </button>
      {result?.ok ? (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      ) : (
        <pre>No result yet </pre>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}

export default CheckServer;
