import {Component, input, output, inject} from '@angular/core';
import {CarEngineDto} from '@carconfig/api-client';
import {CommonInfoModal} from '@carconfig/car-ui';
import {GeneralFunctionsService} from '@carconfig/shared';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-engine-menu-item',
  imports: [TranslocoModule],
  templateUrl: './engine-menu-item.component.html',
  styleUrl: './engine-menu-item.component.scss'
})
export class EngineMenuItemComponent {
  readonly title = input<string | undefined>('');
  readonly description = input<string | undefined>('');
  readonly value = input<CarEngineDto>({});
  readonly isSelected = input<boolean>(false);

  readonly carEngineSelected = output<CarEngineDto>();

  private readonly carConfigCommonInfoModal = inject(CommonInfoModal);
  private readonly carConfigGeneralFunctionsService = inject(GeneralFunctionsService);
  private readonly transloco = inject(TranslocoService);

  selectCarEngine(): void {
    this.carEngineSelected.emit(this.value());
  }

  toCurrencyFormat(price: number | undefined) {
    if (price !== undefined) {
      return this.carConfigGeneralFunctionsService.formatCurrency(price);
    }
    return "";
  }

  getFuelTypeLabel(fuelType: CarEngineDto.FuelTypeEnum | undefined): string {
    switch (fuelType) {
      case CarEngineDto.FuelTypeEnum.Gasoline: return this.transloco.translate('engines.gasoline');
      case CarEngineDto.FuelTypeEnum.Hybrid: return 'Hybrid';
      case CarEngineDto.FuelTypeEnum.Electric: return this.transloco.translate('engines.electric');
      default: return this.transloco.translate('engines.powertrain');
    }
  }

  handleIconClick(eventObj: MouseEvent) {
    eventObj.stopPropagation();
    if(this.value()) {
      const val = this.value();
      if (val?.description) {
        const modalInfo = `${this.transloco.translate('engines.infoTitle')} ${val.model ?? ''}`.trim();
        this.carConfigCommonInfoModal.open(modalInfo, val.description);
      }
    }
  }
}
