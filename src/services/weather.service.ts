import type { AgriculturalField, WeatherReading } from '../models';
import { isFiniteNumber, isRecord } from '../utils/typeGuards';

interface OpenMeteoResponse { current: { temperature_2m: number; time: string; }; }

const WEATHER_REQUEST_ERROR_MESSAGE = 'No fue posible consultar el clima. Revisa tu conexión e intenta nuevamente.';

function isOpenMeteoResponse(value: unknown): value is OpenMeteoResponse {
  if (!isRecord(value) || !isRecord(value.current)) return false;
  return isFiniteNumber(value.current.temperature_2m) && typeof value.current.time === 'string';
}

export async function fetchCurrentWeather(field: AgriculturalField): Promise<WeatherReading> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.search = new URLSearchParams({ latitude: String(field.latitude), longitude: String(field.longitude), current: 'temperature_2m', timezone: 'auto' }).toString();
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Open-Meteo request failed with HTTP status ${response.status}.`);
    const payload: unknown = await response.json();
    if (!isOpenMeteoResponse(payload)) throw new Error('Open-Meteo returned an unexpected weather payload.');
    return { temperature: payload.current.temperature_2m, observedAt: payload.current.time };
  } catch (error: unknown) {
    console.error('[AgroFrost] Weather request failed:', error);
    throw new Error(WEATHER_REQUEST_ERROR_MESSAGE);
  }
}
