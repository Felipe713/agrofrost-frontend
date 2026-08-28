import './styles/global.css';
import './styles/integration.css';
import { initializeFieldForm } from './components/FieldForm';
import type { CreateFieldRequest, FieldDto, FrostAssessmentResponse } from './models';
import { assessFrost, createField, listFields } from './services/agrofrostApi.service';
import { getRequiredElement } from './utils/dom';
import { FrostDashboardView } from './views/frostDashboard.view';

async function bootstrap(): Promise<void> {
  const view = new FrostDashboardView();
  const form = getRequiredElement('field-form', HTMLFormElement);
  let fields: FieldDto[] = [];
  const assessments = new Map<string, FrostAssessmentResponse>();
  let activeLoad: AbortController | null = null;

  const render = (): void => {
    view.renderFields(fields, assessments, handleAssessment);
  };

  async function handleAssessment(fieldId: string, measuredTemperature: number): Promise<FrostAssessmentResponse> {
    activeLoad?.abort();
    activeLoad = null;
    const assessment = await assessFrost(fieldId, { measuredTemperature });
    assessments.set(fieldId, assessment);
    render();
    return assessment;
  }

  const loadFields = async (): Promise<void> => {
    activeLoad?.abort();
    const request = new AbortController();
    activeLoad = request;
    view.showLoading();
    try {
      const loadedFields = await listFields(request.signal);
      if (activeLoad !== request) return;
      fields = loadedFields;
      assessments.clear();
      render();
    } catch (error: unknown) {
      if (request.signal.aborted) return;
      view.showError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    } finally {
      if (activeLoad === request) activeLoad = null;
    }
  };

  initializeFieldForm(form, async (payload: CreateFieldRequest): Promise<void> => {
    activeLoad?.abort();
    activeLoad = null;
    const savedField = await createField(payload);
    fields = [...fields.filter((field) => field.id !== savedField.id), savedField];
    render();
  });
  view.onRetry(() => { void loadFields(); });
  await loadFields();
}

document.addEventListener('DOMContentLoaded', () => {
  void bootstrap().catch(() => {
    document.body.textContent = 'AgroFrost no pudo inicializar la interfaz.';
  });
});
