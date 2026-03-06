export type HealthResponse = { ok: boolean };

export type AnalyzeRequest = { errorMessage: string };

export type AnalyzeResponse = {
  meaning: string;
  likelyCauses: string[];
  fixSteps: string[];
  suggestedCode: string;
};
