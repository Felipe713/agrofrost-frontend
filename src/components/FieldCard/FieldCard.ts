import { FrostRiskLevel, type FrostObservation } from '../../models';

function formatTemperature(value: number): string { return `${value.toFixed(1)} °C`; }
function formatObservedAt(value: string): string { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' }); }

export function createFieldCard(observation: FrostObservation): HTMLElement {
  const article = document.createElement('article');
  article.className = 'field-card';
  const header = document.createElement('div'); header.className = 'card-header';
  const title = document.createElement('div');
  const heading = document.createElement('h3'); heading.textContent = observation.field.name;
  const crop = document.createElement('p'); crop.textContent = observation.field.crop;
  title.append(heading, crop);
  const badge = document.createElement('span'); badge.className = `risk-badge risk-${observation.riskLevel.toLowerCase()}`; badge.textContent = observation.riskLevel;
  header.append(title, badge);
  const temperature = document.createElement('p'); temperature.className = 'temperature'; temperature.textContent = formatTemperature(observation.reading.temperature);
  const label = document.createElement('span'); label.textContent = 'temperatura actual'; temperature.append(label);
  const details = document.createElement('dl');
  const entries: [string, string][] = [['Umbral crítico', formatTemperature(observation.field.criticalTemperature)], ['Coordenadas', `${observation.field.latitude.toFixed(4)}, ${observation.field.longitude.toFixed(4)}`], ['Observación', formatObservedAt(observation.reading.observedAt)]];
  for (const [term, description] of entries) { const dt = document.createElement('dt'); dt.textContent = term; const dd = document.createElement('dd'); dd.textContent = description; details.append(dt, dd); }
  const guidance = document.createElement('p'); guidance.className = 'risk-guidance';
  const textByRisk: Record<FrostRiskLevel, string> = { [FrostRiskLevel.SAFE]: 'Temperatura sobre el margen de precaución.', [FrostRiskLevel.WARNING]: 'Temperatura cercana al umbral del cultivo.', [FrostRiskLevel.CRITICAL]: 'Temperatura igual o inferior al umbral crítico.' };
  guidance.textContent = textByRisk[observation.riskLevel];
  article.append(header, temperature, details, guidance);
  return article;
}
