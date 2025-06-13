export interface Certificate {
  name: string;
  startDate: string;    // Format: YYYY-MM-DD
  endDate: string;      // Format: YYYY-MM-DD
  duration: string;     // e.g., "3 months"
  CIN: string;          // Certificate Identification Number
}

export interface VerificationRequest {
  name: string;
  startDate: string;
}

export interface VerificationResponse {
  success: boolean;
  certificate?: Certificate;
  message?: string;
}