import { Component, input, output, inject } from '@angular/core';
import { CarRimDto } from '../../../../api';
import { CarConfigGeneralFunctionsService } from '../../../../service/car-config-general-functions.service';
import { CarConfigCommonInfoModal } from '../../../../common/car-config-common-info-modal/car-config-common-info-modal';

@Component({
  selector: 'app-car-config-rim-menu-item',
  imports: [],
  templateUrl: './car-config-rim-menu-item.component.html',
  styleUrl: './car-config-rim-menu-item.component.scss'
})
export class CarConfigRimMenuItemComponent {
  readonly value = input<CarRimDto>({});
  readonly isSelected = input<boolean>(false);
  readonly itemSelected = output<CarRimDto>();

  private readonly carConfigGeneralFunctionsService = inject(CarConfigGeneralFunctionsService);
  private readonly carConfigCommonInfoModal = inject(CarConfigCommonInfoModal);

  onClick(): void {
    this.itemSelected.emit(this.value());
  }

  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return this.carConfigGeneralFunctionsService.formatCurrency(price);
    }
    return "inkl.";
  }

  getImage(innerDiameter: number | undefined) {
    const diameter = innerDiameter ?? 17;
    if (diameter === 17) {
      return "assets/felge_01.png";
    } else {
      return "assets/felge_02.png.webp";
    }
  }

  handleIconClick(eventObj: MouseEvent) {
    eventObj.stopPropagation();
    const val = this.value();
    if (val?.description) {
      let modalInfo = val?.model ?? "";
      modalInfo = "Info engine for " + modalInfo + ":";
      this.carConfigCommonInfoModal.open(modalInfo, val.description);
    }
  }
}
