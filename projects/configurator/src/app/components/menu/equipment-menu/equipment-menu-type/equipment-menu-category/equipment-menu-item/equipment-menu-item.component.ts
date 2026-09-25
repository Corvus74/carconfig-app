import { Component, input, output, inject } from '@angular/core';
import { SpecialEquipmentDto } from '@carconfig/api-client';
import { CommonInfoModal } from '@carconfig/car-ui';
import { GeneralFunctionsService } from '@carconfig/shared';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-equipment-menu-item',
  imports: [TranslocoModule],
  templateUrl: './equipment-menu-item.component.html',
  styleUrl: './equipment-menu-item.component.scss',
})
export class EquipmentMenuItemComponent {
  readonly specialEquipment = input.required<SpecialEquipmentDto>();
  readonly isSelected = input(false);
  readonly selectionToggle = output<SpecialEquipmentDto>();

  private readonly infoModal = inject(CommonInfoModal);
  private readonly generalFunctions = inject(GeneralFunctionsService);
  private readonly transloco = inject(TranslocoService);

  toCurrencyFormat(price: number | undefined): string {
    return price ? this.generalFunctions.formatCurrency(price) : this.transloco.translate('common.included');
  }

  openInfo(): void {
    const item = this.specialEquipment();
    if (item.description) {
      this.infoModal.open(`${this.transloco.translate('equipment.infoTitle')} ${item.equipmentName ?? ''}`.trim(), item.description);
    }
  }
}
