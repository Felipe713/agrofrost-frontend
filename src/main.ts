import './styles/global.css';
import { initializeFieldForm } from './components/FieldForm';
import { initialFields } from './data/initialFields';
import { type AgriculturalField, type FieldFormPayload, type FrostObservation } from './models';
import { fetchCurrentWeather } from './services/weather.service';
import { evaluateFrostRisk } from './utils/frostRisk';
import { FrostDashboardView } from './views/frostDashboard.view';

async function bootstrap(): Promise<void> {
  const view = new FrostDashboardView();
  const form = document.getElementById('field-form') as HTMLFormElement | null;
  if (form === null) throw new Error('Required element #field-form is missing.');
  const createObservation = async (field: AgriculturalField): Promise<FrostObservation> => {
    const reading = await fetchCurrentWeather(field);
    return { field, reading, riskLevel: evaluateFrostRisk(reading.temperature, field.criticalTemperature) };
  };
  const loadInitialFields = async (): Promise<void> => {
    view.showLoading();
    try {
      if (initialFields.length === 0) { view.showEmpty(); return; }
      const observations = await Promise.all(initialFields.map(createObservation));
      view.renderObservations(observations);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      view.showError(message);
    }
  };
  initializeFieldForm(form, async (payload: FieldFormPayload): Promise<void> => {
    const field: AgriculturalField = { id: `field-${crypto.randomUUID()}`, ...payload };
    const observation = await createObservation(field);
    view.addObservation(observation);
  });
  view.onRetry(() => { void loadInitialFields(); });
  await loadInitialFields();
}

document.addEventListener('DOMContentLoaded', () => { void bootstrap(); });
