import { createErrorState, createLoadingState, createEmptyState } from '../components/StateView';
import { createFieldCard, type AssessmentHandler } from '../components/FieldCard';
import { FrostRiskLevel, RequestStatus, type FieldDto, type FrostAssessmentResponse } from '../models';
import { getRequiredElement } from '../utils/dom';

export class FrostDashboardView {
  private status: RequestStatus = RequestStatus.IDLE;
  private readonly list = getRequiredElement('field-list', HTMLDivElement);
  private readonly state = getRequiredElement('state-view', HTMLDivElement);
  private readonly fieldCount = getRequiredElement('field-count', HTMLSpanElement);
  private readonly criticalCount = getRequiredElement('critical-count', HTMLSpanElement);
  private readonly retryButton = getRequiredElement('retry-button', HTMLButtonElement);
  showLoading(): void { this.setStatus(RequestStatus.LOADING); this.state.replaceChildren(createLoadingState()); this.retryButton.hidden = true; }
  showError(message: string): void { this.setStatus(RequestStatus.ERROR); this.state.replaceChildren(createErrorState(message)); this.retryButton.hidden = false; }
  showEmpty(): void { this.setStatus(RequestStatus.EMPTY); this.list.replaceChildren(); this.state.replaceChildren(createEmptyState()); this.retryButton.hidden = true; this.updateCounters([], new Map()); }
  renderFields(fields: FieldDto[], assessments: ReadonlyMap<string, FrostAssessmentResponse>, onAssess: AssessmentHandler): void { if (fields.length === 0) { this.showEmpty(); return; } this.setStatus(RequestStatus.SUCCESS); this.state.replaceChildren(); this.list.replaceChildren(...fields.map((field) => createFieldCard(field, assessments.get(field.id), onAssess))); this.retryButton.hidden = true; this.updateCounters(fields, assessments); }
  onRetry(handler: () => void): void { this.retryButton.addEventListener('click', handler); }
  private updateCounters(fields: FieldDto[], assessments: ReadonlyMap<string, FrostAssessmentResponse>): void { this.fieldCount.textContent = String(fields.length); this.criticalCount.textContent = String([...assessments.values()].filter((item) => item.riskLevel === FrostRiskLevel.CRITICAL).length); }
  private setStatus(status: RequestStatus): void { this.status = status; this.state.setAttribute('aria-busy', String(this.status === RequestStatus.LOADING)); }
}
