import {
  FrostRiskLevel,
  type ErrorResponse,
  type FieldDto,
  type FrostAssessmentResponse,
} from '../models/api.model';
import { isFiniteNumber, isRecord } from './typeGuards';

function isNonNullString(value: unknown): value is string {
  return typeof value === 'string';
}

function isFrostRiskLevel(value: unknown): value is FrostRiskLevel {
  return value === FrostRiskLevel.SAFE
    || value === FrostRiskLevel.WARNING
    || value === FrostRiskLevel.CRITICAL;
}

export function isFieldDto(value: unknown): value is FieldDto {
  return isRecord(value)
    && isNonNullString(value.id)
    && isNonNullString(value.name)
    && isNonNullString(value.crop)
    && isFiniteNumber(value.criticalTemperature);
}

export function isFieldDtoArray(value: unknown): value is FieldDto[] {
  return Array.isArray(value) && value.every(isFieldDto);
}

export function isFrostAssessmentResponse(value: unknown): value is FrostAssessmentResponse {
  return isRecord(value)
    && isNonNullString(value.fieldId)
    && isFiniteNumber(value.measuredTemperature)
    && isFiniteNumber(value.criticalTemperature)
    && isFrostRiskLevel(value.riskLevel);
}

export function isErrorResponse(value: unknown): value is ErrorResponse {
  return isRecord(value)
    && isNonNullString(value.timestamp)
    && !Number.isNaN(Date.parse(value.timestamp))
    && isFiniteNumber(value.status)
    && Number.isInteger(value.status)
    && isNonNullString(value.error)
    && isNonNullString(value.code)
    && isNonNullString(value.message)
    && isNonNullString(value.path);
}
