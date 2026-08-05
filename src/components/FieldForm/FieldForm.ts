import type { FieldFormPayload } from '../../models';
import { validateFieldPayload } from '../../utils/validators';

export type FieldSubmitHandler = (payload: FieldFormPayload) => Promise<void>;

export function initializeFieldForm(form: HTMLFormElement, onSubmit: FieldSubmitHandler): void {
  const feedback = document.getElementById('form-feedback') as HTMLDivElement | null;
  const submitButton = document.getElementById('submit-field') as HTMLButtonElement | null;
  if (feedback === null || submitButton === null) throw new Error('Required form feedback elements are missing.');
  form.addEventListener('submit', async (event: SubmitEvent) => {
    event.preventDefault();
    const nameInput = document.getElementById('field-name') as HTMLInputElement | null;
    const cropInput = document.getElementById('crop') as HTMLInputElement | null;
    const latitudeInput = document.getElementById('latitude') as HTMLInputElement | null;
    const longitudeInput = document.getElementById('longitude') as HTMLInputElement | null;
    const criticalInput = document.getElementById('critical-temperature') as HTMLInputElement | null;
    if (nameInput === null || cropInput === null || latitudeInput === null || longitudeInput === null || criticalInput === null) throw new Error('Required form inputs are missing.');
    const payload: FieldFormPayload = { name: nameInput.value.trim(), crop: cropInput.value.trim(), latitude: Number(latitudeInput.value), longitude: Number(longitudeInput.value), criticalTemperature: Number(criticalInput.value) };
    const errors = validateFieldPayload(payload);
    feedback.replaceChildren();
    if (errors.length > 0) { feedback.textContent = errors.join(' '); feedback.className = 'form-feedback error'; return; }
    submitButton.disabled = true; submitButton.textContent = 'Consultando…';
    try { await onSubmit(payload); form.reset(); feedback.textContent = 'Campo consultado y agregado al panel.'; feedback.className = 'form-feedback success'; }
    catch (error: unknown) { const message = error instanceof Error ? error.message : 'An unexpected error occurred.'; feedback.textContent = message; feedback.className = 'form-feedback error'; }
    finally { submitButton.disabled = false; submitButton.textContent = 'Consultar campo'; }
  });
}
