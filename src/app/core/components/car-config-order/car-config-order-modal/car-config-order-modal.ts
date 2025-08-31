import {ChangeDetectionStrategy, Component, Inject, Injectable} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Modal} from 'bootstrap';

@Component({
  selector: 'app-car-config-order-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './car-config-order-modal.html',
  styleUrl: './car-config-order-modal.scss'
})
@Injectable({ providedIn: 'root' })
export class CarConfigOrderModal {
  constructor() {}

  open(title:string, message: string,showModalForConfirmLink:boolean=false): Promise<boolean> {
    // Bootstrap-Modal-Container erzeugen
    const modalEl = document.createElement('div');
    modalEl.className = 'modal fade';
    modalEl.tabIndex = -1;
    modalEl.setAttribute('aria-hidden', 'true');
    if(showModalForConfirmLink){
      modalEl.innerHTML= this.showModalForConfirmLink(title,message);
    }
    else {
      modalEl.innerHTML = this.getCodeForTwoButtonModal(title,message)
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
        // hide wird durch data-bs-dismiss bereits ausgelöst
      });

      modalEl.addEventListener('hidden.bs.modal', () => {
        // Falls der Nutzer per ESC oder Backdrop schließt, nichts doppelt resolven:
        // Wenn noch nicht resolved, oben wurde nicht getriggert -> resolve(false)
        // Sicherstellen, dass Promise immer erfüllt wird:
        // Trick: setTimeout, um Doppel-Resolve zu vermeiden
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

  private showModalForConfirmLink(title:string, message:string) {
    return  `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${this.escapeHtml(title)}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Your order has been successfully submitted. Please copy the underlying link and send it to the customer. Or copy it.
            After clicking on the link the order will be closed.</p>
           <p>
            <a href=${message}>${this.escapeHtml(message)}</a>
            </p>
          </div>
          <div class="modal-footer">
            <button id="confirmBtn" type="button" class="btn btn-primary">Ok</button>
          </div>
        </div>
      </div>
    `;
  }
  private getCodeForTwoButtonModal(title:string, message:string) {
    return  `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${this.escapeHtml(title)}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${this.escapeHtml(message)}</p>
          </div>
          <div class="modal-footer">
            <button id="cancelBtn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button id="confirmBtn" type="button" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    `;
  }
}

