import axios from "axios";
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  HealthResponse,
} from "../types/api";

export async function analyzeError(
  payload: AnalyzeRequest,
): Promise<AnalyzeResponse> {
  const response = await axios.post<AnalyzeResponse>("/api/analyze", payload);
  return response.data;
}

export async function checkServer(): Promise<HealthResponse> {
  const response = await axios.get<HealthResponse>("/health");
  return response.data;
}
