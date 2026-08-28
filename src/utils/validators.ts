import type { CreateFieldRequest } from '../models';

export function validateFieldPayload(payload: CreateFieldRequest): string[] {
  const errors: string[] = [];
  if (payload.id.length === 0) errors.push('El identificador del Field es obligatorio.');
  if (payload.name.length === 0) errors.push('El nombre del campo es obligatorio.');
  if (payload.crop.length === 0) errors.push('El cultivo es obligatorio.');
  if (!Number.isFinite(payload.criticalTemperature) || payload.criticalTemperature < -10 || payload.criticalTemperature > 10) errors.push('La temperatura crítica debe estar entre -10 y 10 °C.');
  return errors;
}
