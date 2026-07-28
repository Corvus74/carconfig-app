import {Component, input, output, inject} from '@angular/core';
import {CarEngineDto} from '../../../../api';
import {CarConfigCommonInfoModal} from '../../../../common/car-config-common-info-modal/car-config-common-info-modal';
import {CarConfigGeneralFunctionsService} from '../../../../service/car-config-general-functions.service';

@Component({
  selector: 'app-car-config-engine-menu-item',
  imports: [],
  templateUrl: './car-config-engine-menu-item.component.html',
  styleUrl: './car-config-engine-menu-item.component.scss'
})
export class CarConfigEngineMenuItemComponent {
  readonly title = input<string | undefined>('');
  readonly description = input<string | undefined>('');
  readonly value = input<CarEngineDto>({});
  readonly isSelected = input<boolean>(false);

  readonly carEngineSelected = output<CarEngineDto>();

  private readonly carConfigCommonInfoModal = inject(CarConfigCommonInfoModal);
  private readonly carConfigGeneralFunctionsService = inject(CarConfigGeneralFunctionsService);

  selectCarEngine(): void {
    this.carEngineSelected.emit(this.value());
  }

  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return this.carConfigGeneralFunctionsService.formatCurrency(price);
    }
    return "";
  }

  handleIconClick(eventObj: MouseEvent) {
    eventObj.stopPropagation();
    if(this.value()) {
      const val = this.value();
      if (val?.description) {
        let modalInfo = val?.model ?? "";
        modalInfo = "Info engine for " + modalInfo + ":";
        this.carConfigCommonInfoModal.open(modalInfo, val.description);
      }
    }
  }
}
