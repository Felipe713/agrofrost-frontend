import type {
  CreateFieldRequest,
  ErrorResponse,
  FieldDto,
  FrostAssessmentRequest,
  FrostAssessmentResponse,
} from '../models';
import {
  isErrorResponse,
  isFieldDto,
  isFieldDtoArray,
  isFrostAssessmentResponse,
} from '../utils/apiGuards';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080')
  .replace(/\/$/, '');

type PayloadGuard<T> = (value: unknown) => value is T;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null = null,
    readonly code: string | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new ApiError('El servidor devolvió una respuesta que no se pudo interpretar.', response.status);
  }
}

async function apiRequest<T>(
  path: string,
  expectedStatus: number,
  guard: PayloadGuard<T>,
  init: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { Accept: 'application/json', ...init.headers },
    });
  } catch {
    throw new ApiError('No fue posible conectar con AgroFrost. Revisa los servicios e intenta nuevamente.');
  }

  const payload = await parseJson(response);
  if (!response.ok) {
    if (isErrorResponse(payload) && payload.status === response.status) {
      throw new ApiError(payload.message, payload.status, payload.code);
    }
    throw new ApiError('AgroFrost no pudo completar la solicitud.', response.status);
  }
  if (response.status !== expectedStatus || !guard(payload)) {
    throw new ApiError('La respuesta de AgroFrost no cumple el contrato esperado.', response.status);
  }
  return payload;
}

export function listFields(signal?: AbortSignal): Promise<FieldDto[]> {
  return apiRequest('/api/v1/fields', 200, isFieldDtoArray, { method: 'GET', signal });
}

export function createField(request: CreateFieldRequest): Promise<FieldDto> {
  return apiRequest('/api/v1/fields', 201, isFieldDto, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

export function assessFrost(
  fieldId: string,
  request: FrostAssessmentRequest,
): Promise<FrostAssessmentResponse> {
  return apiRequest(
    `/api/v1/fields/${encodeURIComponent(fieldId)}/assessments`,
    200,
    isFrostAssessmentResponse,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    },
  );
}

export type { ErrorResponse };
