import { FrostRiskLevel } from '../models';

export function evaluateFrostRisk(measuredTemperature: number, criticalTemperature: number): FrostRiskLevel {
  if (measuredTemperature <= criticalTemperature) return FrostRiskLevel.CRITICAL;
  if (measuredTemperature <= criticalTemperature + 2) return FrostRiskLevel.WARNING;
  return FrostRiskLevel.SAFE;
}
