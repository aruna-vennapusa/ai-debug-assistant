import { useState } from "react";
import axios from "axios";

function App() {
  type HealthResponse = { ok: boolean };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthResponse | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      setErrorState(null);
      setResult(null);
      setLoading(true);
      const response = await axios.get<HealthResponse>("/health");
      setResult(response.data);
    } catch (err) {
      if (err instanceof Error) {
        setErrorState(err.message);
      } else {
        setErrorState("Something went wrong");
      } // save error message
    } finally {
      setLoading(false); // stop waiting
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

      {errorState && <p style={{ color: "red" }}>{errorState}</p>}
    </>
  );
}

export default App;
