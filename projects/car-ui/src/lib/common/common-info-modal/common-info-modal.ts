import { ChangeDetectionStrategy, Component, Injectable, inject } from '@angular/core';
import {Modal} from 'bootstrap';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-car-config-common-info-modal',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Injectable({ providedIn: 'root' })
export class CommonInfoModal {
  private readonly transloco = inject(TranslocoService);

  open(title: string, message: string): void {
    const existing = document.getElementById('commonInfoModal');
    if (existing) {
      Modal.getInstance(existing)?.dispose();
      existing.remove();
    }

    const modalEl = document.createElement('div');
    modalEl.id = 'commonInfoModal';
    modalEl.className = 'modal fade car-config-info-modal';
    modalEl.tabIndex = -1;
    modalEl.setAttribute('aria-labelledby', 'commonInfoModalLabel');
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <span class="info-modal-icon" aria-hidden="true"><i class="bi bi-info-lg"></i></span>
            <h2 class="modal-title" id="commonInfoModalLabel"></h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${this.transloco.translate('common.close')}"></button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">${this.transloco.translate('common.understood')}</button>
          </div>
        </div>
      </div>`;
    modalEl.querySelector('.modal-title')!.textContent = title;
    modalEl.querySelector('.modal-body')!.textContent = message;
    document.body.appendChild(modalEl);

    const modal = new Modal(modalEl, { backdrop: true, keyboard: true, focus: true });
    modal.show();

    modalEl.addEventListener('hidden.bs.modal', () => {
      modal.dispose();
      modalEl.remove();
    });
  }
}
