export interface LaunchRequest {
  targetId: string;
  query: string;
  source?: string;
}

export interface LaunchResponse {
  success: boolean;
  error?: string;
}
