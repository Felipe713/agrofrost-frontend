import {
  FrostRiskLevel,
  type FieldDto,
  type FrostAssessmentResponse,
} from '../../models';

function formatTemperature(value: number): string { return `${value.toFixed(1)} °C`; }

export type AssessmentHandler = (
  fieldId: string,
  measuredTemperature: number,
) => Promise<FrostAssessmentResponse>;

export function createFieldCard(
  field: FieldDto,
  assessment: FrostAssessmentResponse | undefined,
  onAssess: AssessmentHandler,
): HTMLElement {
  const article = document.createElement('article');
  article.className = 'field-card';
  const header = document.createElement('div'); header.className = 'card-header';
  const title = document.createElement('div');
  const heading = document.createElement('h3'); heading.textContent = field.name;
  const crop = document.createElement('p'); crop.textContent = field.crop;
  title.append(heading, crop);
  const badge = document.createElement('span');
  badge.className = assessment === undefined
    ? 'risk-badge risk-pending'
    : `risk-badge risk-${assessment.riskLevel.toLowerCase()}`;
  badge.textContent = assessment?.riskLevel ?? 'SIN EVALUAR';
  header.append(title, badge);
  const details = document.createElement('dl');
  const entries: [string, string][] = [
    ['Field ID', field.id],
    ['Umbral crítico', formatTemperature(field.criticalTemperature)],
  ];
  if (assessment !== undefined) entries.push(['Temperatura medida', formatTemperature(assessment.measuredTemperature)]);
  for (const [term, description] of entries) { const dt = document.createElement('dt'); dt.textContent = term; const dd = document.createElement('dd'); dd.textContent = description; details.append(dt, dd); }
  const guidance = document.createElement('p'); guidance.className = 'risk-guidance'; guidance.setAttribute('aria-live', 'polite');
  const textByRisk: Record<FrostRiskLevel, string> = { [FrostRiskLevel.SAFE]: 'Temperatura sobre el margen de precaución.', [FrostRiskLevel.WARNING]: 'Temperatura cercana al umbral del cultivo.', [FrostRiskLevel.CRITICAL]: 'Temperatura igual o inferior al umbral crítico.' };
  guidance.textContent = assessment === undefined
    ? 'Ingresa una temperatura para solicitar una evaluación al backend.'
    : textByRisk[assessment.riskLevel];

  const form = document.createElement('form'); form.className = 'assessment-form';
  const label = document.createElement('label'); label.textContent = 'Temperatura medida (°C)';
  const input = document.createElement('input');
  input.type = 'number'; input.step = '0.1'; input.min = '-50'; input.max = '60'; input.required = true;
  input.setAttribute('inputmode', 'decimal');
  label.append(input);
  const feedback = document.createElement('p'); feedback.className = 'assessment-feedback'; feedback.setAttribute('aria-live', 'polite');
  const button = document.createElement('button'); button.type = 'submit'; button.className = 'button button-small'; button.textContent = 'Evaluar helada';
  form.append(label, feedback, button);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = input.value.trim() === '' ? Number.NaN : input.valueAsNumber;
    if (!Number.isFinite(value) || value < -50 || value > 60) {
      feedback.textContent = 'Ingresa una temperatura entre -50 y 60 °C.';
      feedback.className = 'assessment-feedback error';
      return;
    }
    button.disabled = true; button.textContent = 'Evaluando...'; feedback.textContent = '';
    try {
      await onAssess(field.id, value);
    } catch (error: unknown) {
      feedback.textContent = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
      feedback.className = 'assessment-feedback error';
      button.disabled = false; button.textContent = 'Reintentar evaluación';
    }
  });
  article.append(header, details, guidance, form);
  return article;
}
