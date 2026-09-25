import { Component, computed, inject } from '@angular/core';
import { CarConfigStoreService, CarTabMenuChangeService } from '@carconfig/car-state';
import { GeneralFunctionsService } from '@carconfig/shared';
import { TranslocoModule } from '@jsverse/transloco';

interface SelectedCarItem {
  label: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-car-information',
  templateUrl: './car-information.component.html',
  imports: [TranslocoModule],
  styleUrl: './car-information.component.scss',
})
export class CarInformationComponent {
  private readonly carConfigStore = inject(CarConfigStoreService);
  private readonly tabMenuChange = inject(CarTabMenuChangeService);
  private readonly generalFunctions = inject(GeneralFunctionsService);

  readonly engine = this.carConfigStore.engine;
  readonly color = this.carConfigStore.color;
  readonly rims = this.carConfigStore.rims;
  readonly specialEquipment = this.carConfigStore.specialEquipment;
  readonly carMenuTabs = this.tabMenuChange.carConfigTabInfoData;

  readonly selectedItems = computed<SelectedCarItem[]>(() => {
    const items: SelectedCarItem[] = [];
    const engine = this.engine();
    const color = this.color();
    const rims = this.rims();

    if (engine) items.push({ label: 'config.engine', name: engine.model || engine.description || '—', price: engine.price ?? 0 });
    if (color) items.push({ label: 'config.color', name: color.colorName || color.description || '—', price: color.price ?? 0 });
    if (rims) items.push({ label: 'config.rims', name: rims.rimName || rims.model || '—', price: rims.price ?? 0 });
    for (const equipment of this.specialEquipment()) {
      items.push({ label: 'config.equipment', name: equipment.equipmentName || equipment.description || '—', price: equipment.price ?? 0 });
    }

    return items;
  });

  readonly totalPrice = computed(() => this.selectedItems().reduce((total, item) => total + item.price, 0));
  readonly formattedTotalPrice = computed(() => this.toCurrencyFormat(this.totalPrice()));
  readonly showCarInfo = computed(() => !this.carMenuTabs()?.showOrder);
  readonly showFinishedOrder = computed(() => !!this.carMenuTabs()?.tabSpecialEquipment);

  toCurrencyFormat(price: number): string {
    return this.generalFunctions.formatCurrency(price);
  }

  onEarlyFinishedOrder(): void {
    const tabs = this.carMenuTabs();
    if (tabs) this.tabMenuChange.updateTabStatus({ ...tabs, showOrder: true });
  }
}
