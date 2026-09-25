import {ChangeDetectionStrategy, Component, inject, Injectable} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Modal} from 'bootstrap';
import { TranslocoService } from '@jsverse/transloco';
import ModalTypeEnum = ModalOptions.ModalTypeEnum;

export interface ModalOptions {
  modalType: ModalTypeEnum,
  title:string,
  message: string,
}

export namespace ModalOptions{
  export const ModalTypeEnum = {
    ConfirmOrder: 'CONFIRM_ORDER',
    ShowShareLink: 'SHOW_SHARE_LINK',
    ShowEdit: 'SHOW_EDIT',
    ShowDelete: 'Show_DELETE'
  } as const;
  export type ModalTypeEnum = typeof ModalTypeEnum[keyof typeof ModalTypeEnum];
}
@Component({
  selector: 'app-car-config-order-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-modal.html',
  styleUrl: './order-modal.scss'
})
@Injectable({ providedIn: 'root' })
export class OrderModal {
  private readonly transloco = inject(TranslocoService);

  open(modalOptions:ModalOptions): Promise<boolean> {
    const modalEl = document.createElement('div');
    modalEl.className = 'modal fade';
    modalEl.tabIndex = -1;
    modalEl.setAttribute('aria-hidden', 'true');
    if (modalOptions.modalType === ModalOptions.ModalTypeEnum.ShowShareLink) {
      modalEl.innerHTML = this.showModalForSharingLink(modalOptions);
    } else {
      modalEl.innerHTML = this.getCodeForTwoButtonModal(modalOptions);
    }

    document.body.appendChild(modalEl);

    const bsModal = new Modal(modalEl, {
      backdrop: true,
      focus: true,
      keyboard: true
    });

    return new Promise<boolean>((resolve) => {
      const cleanup = () => {
        bsModal.dispose();
        modalEl.remove();
      };

      const confirmBtn = modalEl.querySelector<HTMLButtonElement>('#confirmBtn');
      const cancelBtn = modalEl.querySelector<HTMLButtonElement>('#cancelBtn');

      confirmBtn?.addEventListener('click', () => {
        resolve(true);
        bsModal.hide();
      });

      cancelBtn?.addEventListener('click', () => {
        resolve(false);
        // Hiding is already triggered by data-bs-dismiss.
      });

      modalEl.addEventListener('hidden.bs.modal', () => {
        // Resolve false when the user closes with Escape or the backdrop.
        // Resolve on the next task so the button handler cannot resolve twice.
        setTimeout(() => {
          try { resolve(false); } catch {}
          cleanup();
        }, 0);
      }, { once: true });

      bsModal.show();
    });
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  private getCodeForTwoButtonModal(modalOptions: ModalOptions) {
    return  `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${this.escapeHtml(modalOptions.title)}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${this.transloco.translate('common.close')}"></button>
          </div>
          <div class="modal-body">
            <p>${this.escapeHtml(modalOptions.message)}</p>
          </div>
          <div class="modal-footer">
            <button id="cancelBtn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.transloco.translate('common.cancel')}</button>
            <button id="confirmBtn" type="button" class="btn btn-primary">${this.transloco.translate('common.confirm')}</button>
          </div>
        </div>
      </div>
    `;
  }
  private showModalForSharingLink(modaloptions:ModalOptions) {
    return  `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${this.escapeHtml(modaloptions.title)}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="${this.transloco.translate('common.close')}"></button>
          </div>
          <div class="modal-body">
            <p>${this.transloco.translate('checkout.shareDescription')}</p>
           <p>
            <a href=${modaloptions.message}>${this.escapeHtml(modaloptions.message)}</a>
            </p>
          </div>
          <div class="modal-footer">
            <button id="confirmBtn" type="button" class="btn btn-primary">Ok</button>
          </div>
        </div>
      </div>
    `;
  }

}

