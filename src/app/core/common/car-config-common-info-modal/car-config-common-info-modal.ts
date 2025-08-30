import {ChangeDetectionStrategy, Component, Inject, Injectable} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Modal} from 'bootstrap';

@Component({
  selector: 'app-car-config-common-info-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './car-config-common-info-modal.html',
  styleUrl: './car-config-common-info-modal.scss'
})
@Injectable({ providedIn: 'root' })
export class CarConfigCommonInfoModal {
  constructor() {}

  open(title: string, message: string): void {
    // Vorherige Instanzen entfernen (gleiches ID)
    const existing = document.getElementById('commonInfoModal');
    if (existing?.parentElement) {
      existing.parentElement.removeChild(existing);
    }

    const container = document.createElement('div');
    container.innerHTML = this.getContentOfModal(title, message).trim();
    const modalEl = container.firstElementChild as HTMLElement;
    document.body.appendChild(modalEl);

    const modal = new Modal(modalEl, { backdrop: true, keyboard: true, focus: true });
    modal.show();

    // Beim Schließen aus dem DOM entfernen
    modalEl.addEventListener('hidden.bs.modal', () => {
      modal.dispose();
      modalEl.remove();
    });
  }


  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  private getContentOfModal(title:string, message:string) {
    return  `
        <div class="modal fade" id="magazinModal" tabindex="-1" aria-labelledby="magazinModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg rounded-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title font-bold" id="magazinModalLabel">${this.escapeHtml(title)}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

            <div class="clearfix">

              <img src="https://placehold.co/200x250/374151/ffffff?text=Bild"
                   alt="Layout Beispielbild"
                   class="float-left rounded-lg shadow-md mr-6 mb-4">

              <!-- Der Text, der das Bild umfließt -->
              <p class="text-gray-700 leading-relaxed text-justify">
                ${this.escapeHtml(message)}
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary rounded-xl" data-bs-dismiss="modal">Schließen</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

