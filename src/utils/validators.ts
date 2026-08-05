import type { FieldFormPayload } from '../models';

export function validateFieldPayload(payload: FieldFormPayload): string[] {
  const errors: string[] = [];
  if (payload.name.length === 0) errors.push('El nombre del campo es obligatorio.');
  if (payload.crop.length === 0) errors.push('El cultivo es obligatorio.');
  if (!Number.isFinite(payload.latitude) || payload.latitude < -90 || payload.latitude > 90) errors.push('La latitud debe estar entre -90 y 90.');
  if (!Number.isFinite(payload.longitude) || payload.longitude < -180 || payload.longitude > 180) errors.push('La longitud debe estar entre -180 y 180.');
  if (!Number.isFinite(payload.criticalTemperature) || payload.criticalTemperature < -10 || payload.criticalTemperature > 10) errors.push('La temperatura crítica debe estar entre -10 y 10 °C.');
  return errors;
}
