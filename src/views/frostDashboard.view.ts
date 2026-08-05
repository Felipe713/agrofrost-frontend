import { createErrorState, createLoadingState, createEmptyState } from '../components/StateView';
import { createFieldCard } from '../components/FieldCard';
import { FrostRiskLevel, RequestStatus, type FrostObservation } from '../models';
import { getRequiredElement } from '../utils/dom';

export class FrostDashboardView {
  private status: RequestStatus = RequestStatus.IDLE;
  private readonly list = getRequiredElement('field-list', HTMLDivElement);
  private readonly state = getRequiredElement('state-view', HTMLDivElement);
  private readonly fieldCount = getRequiredElement('field-count', HTMLSpanElement);
  private readonly criticalCount = getRequiredElement('critical-count', HTMLSpanElement);
  private readonly retryButton = getRequiredElement('retry-button', HTMLButtonElement);
  showLoading(): void { this.setStatus(RequestStatus.LOADING); this.list.replaceChildren(); this.state.replaceChildren(createLoadingState()); this.retryButton.hidden = true; }
  showError(message: string): void { this.setStatus(RequestStatus.ERROR); this.list.replaceChildren(); this.state.replaceChildren(createErrorState(message)); this.retryButton.hidden = false; }
  showEmpty(): void { this.setStatus(RequestStatus.EMPTY); this.list.replaceChildren(); this.state.replaceChildren(createEmptyState()); this.retryButton.hidden = true; this.updateCounters([]); }
  renderObservations(observations: FrostObservation[]): void { if (observations.length === 0) { this.showEmpty(); return; } this.setStatus(RequestStatus.SUCCESS); this.state.replaceChildren(); this.list.replaceChildren(...observations.map(createFieldCard)); this.retryButton.hidden = true; this.updateCounters(observations); }
  addObservation(observation: FrostObservation): void { this.setStatus(RequestStatus.SUCCESS); this.state.replaceChildren(); this.list.append(createFieldCard(observation)); const cards = this.list.querySelectorAll('.field-card'); this.fieldCount.textContent = String(cards.length); if (observation.riskLevel === FrostRiskLevel.CRITICAL) this.criticalCount.textContent = String(Number(this.criticalCount.textContent) + 1); }
  onRetry(handler: () => void): void { this.retryButton.addEventListener('click', handler); }
  private updateCounters(observations: FrostObservation[]): void { this.fieldCount.textContent = String(observations.length); this.criticalCount.textContent = String(observations.filter((item) => item.riskLevel === FrostRiskLevel.CRITICAL).length); }
  private setStatus(status: RequestStatus): void { this.status = status; this.state.setAttribute('aria-busy', String(this.status === RequestStatus.LOADING)); }
}
