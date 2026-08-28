import type { CreateFieldRequest } from '../../models';
import { getRequiredElement } from '../../utils/dom';
import { validateFieldPayload } from '../../utils/validators';

export type FieldSubmitHandler = (payload: CreateFieldRequest) => Promise<void>;

export function initializeFieldForm(form: HTMLFormElement, onSubmit: FieldSubmitHandler): void {
  const feedback = getRequiredElement('form-feedback', HTMLDivElement);
  const submitButton = getRequiredElement('submit-field', HTMLButtonElement);
  const idInput = getRequiredElement('field-id', HTMLInputElement);
  const nameInput = getRequiredElement('field-name', HTMLInputElement);
  const cropInput = getRequiredElement('crop', HTMLInputElement);
  const criticalInput = getRequiredElement('critical-temperature', HTMLInputElement);

  form.addEventListener('submit', async (event: SubmitEvent) => {
    event.preventDefault();
    const criticalTemperature = criticalInput.value.trim() === ''
      ? Number.NaN
      : criticalInput.valueAsNumber;
    const payload: CreateFieldRequest = {
      id: idInput.value.trim(),
      name: nameInput.value.trim(),
      crop: cropInput.value.trim(),
      criticalTemperature,
    };
    const errors = validateFieldPayload(payload);
    feedback.replaceChildren();
    if (errors.length > 0) {
      feedback.textContent = errors.join(' ');
      feedback.className = 'form-feedback error';
      return;
    }
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';
    try {
      await onSubmit(payload);
      form.reset();
      feedback.textContent = 'Field guardado en PostgreSQL y agregado al panel.';
      feedback.className = 'form-feedback success';
    } catch (error: unknown) {
      feedback.textContent = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
      feedback.className = 'form-feedback error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Registrar Field';
    }
  });
}
