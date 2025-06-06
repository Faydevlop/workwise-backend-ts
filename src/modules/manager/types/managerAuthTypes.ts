export interface LoginResult {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  manager?: any;
}
