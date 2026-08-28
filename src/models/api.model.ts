export enum FrostRiskLevel {
  SAFE = 'SAFE',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export interface FieldDto {
  id: string;
  name: string;
  crop: string;
  criticalTemperature: number;
}

export interface CreateFieldRequest {
  id: string;
  name: string;
  crop: string;
  criticalTemperature: number;
}

export interface FrostAssessmentRequest {
  measuredTemperature: number;
}

export interface FrostAssessmentResponse {
  fieldId: string;
  measuredTemperature: number;
  criticalTemperature: number;
  riskLevel: FrostRiskLevel;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  code: string;
  message: string;
  path: string;
}
