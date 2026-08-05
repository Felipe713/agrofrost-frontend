import type { AgriculturalField } from '../models';

export const initialFields: AgriculturalField[] = [
  { id: 'los-robles', name: 'Huerto Los Robles', crop: 'Manzanos', latitude: -36.6066, longitude: -72.1034, criticalTemperature: -1.5 },
  { id: 'valle-claro', name: 'Viñedo Valle Claro', crop: 'Uvas', latitude: -34.9827, longitude: -71.2394, criticalTemperature: 0 },
  { id: 'santa-lucia', name: 'Cerezos Santa Lucía', crop: 'Cerezos', latitude: -35.4264, longitude: -71.6664, criticalTemperature: -0.5 }
];
