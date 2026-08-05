import type { AgriculturalField } from './field.model';

export enum FrostRiskLevel { SAFE = 'SAFE', WARNING = 'WARNING', CRITICAL = 'CRITICAL' }

export interface WeatherReading { temperature: number; observedAt: string; }

export interface FrostObservation { field: AgriculturalField; reading: WeatherReading; riskLevel: FrostRiskLevel; }
