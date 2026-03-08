export type HealthResponse = { ok: boolean };

export type AnalyzeRequest = { errorMessage: string; codeSnippet?: string };

export type AnalyzeResponse = {
  meaning: string;
  likelyCauses: string[];
  fixSteps: string[];
  suggestedCode?: string;
};
