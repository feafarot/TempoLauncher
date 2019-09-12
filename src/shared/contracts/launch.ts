export interface LaunchRequest {
  targetId: string;
}

export interface LaunchResponse {
  success: boolean;
  error?: string;
}
