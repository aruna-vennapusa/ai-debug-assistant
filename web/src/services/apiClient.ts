import axios from "axios";
import type { AnalyzeRequest, AnalyzeResponse } from "../types/api";

export async function analyzeError(
  payload: AnalyzeRequest,
): Promise<AnalyzeResponse> {
  const response = await axios.post<AnalyzeResponse>("/api/analyze", payload);
  return response.data;
}
