export interface AgriculturalField {
  id: string;
  name: string;
  crop: string;
  latitude: number;
  longitude: number;
  criticalTemperature: number;
}

export interface FieldFormPayload {
  name: string;
  crop: string;
  latitude: number;
  longitude: number;
  criticalTemperature: number;
}
