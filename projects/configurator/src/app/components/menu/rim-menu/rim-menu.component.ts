import { Component, ElementRef, input, output, viewChild, inject, computed, effect } from '@angular/core';
import { CarRimDto } from '@carconfig/api-client';
import { RimMenuItemComponent } from './rim-menu-item/rim-menu-item.component';
import { CarConfigStoreService } from '@carconfig/car-state';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-rim-menu',
  imports: [
    RimMenuItemComponent,
    TranslocoModule
  ],
  templateUrl: './rim-menu.component.html',
  styleUrl: './rim-menu.component.scss'
})
export class RimMenuComponent {
  readonly carRims = input<CarRimDto[] | undefined>(undefined);
  readonly selectedValue = input<CarRimDto | undefined>(undefined);
  readonly container = viewChild<ElementRef<HTMLElement>>('container');
  readonly selectionChange = output<void>();

  private readonly carConfigStoreService = inject(CarConfigStoreService);
  readonly selectedRim = computed(() => this.carConfigStoreService.rims() ?? this.selectedValue());

  private readonly scrollToSelectedEffect = effect(() => {
    const rims = this.carRims();
    const selectedProductId = this.selectedRim()?.productId;
    if (!rims?.length || !selectedProductId || !rims.some(rim => rim.productId === selectedProductId)) return;
    requestAnimationFrame(() => this.scrollToRim(selectedProductId));
  });

  onItemSelected(value: CarRimDto): void {
    this.carConfigStoreService.updateRims(value);
    this.selectionChange.emit();
  }

  private scrollToRim(productId: string): void {
    const items = this.container()?.nativeElement.querySelectorAll<HTMLElement>('[data-rim-id]');
    const selectedItem = items && Array.from(items).find(item => item.dataset['rimId'] === productId);
    selectedItem?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }
}
