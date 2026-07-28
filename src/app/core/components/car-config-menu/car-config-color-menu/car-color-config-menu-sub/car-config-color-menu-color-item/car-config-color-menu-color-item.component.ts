import { Component, input, output, OnInit, inject } from '@angular/core';
import { CarColorDto } from '../../../../../api';
import { CarConfigColorviewCircle } from '../../../../../common/car-config-colorview-circle/car-config-colorview-circle';
import { CarConfigCommonInfoModal } from '../../../../../common/car-config-common-info-modal/car-config-common-info-modal';
import { CarConfigGeneralFunctionsService } from '../../../../../service/car-config-general-functions.service';

@Component({
  selector: 'app-car-config-color-menu-color-item',
  imports: [
    CarConfigColorviewCircle
  ],
  templateUrl: './car-config-color-menu-color-item.component.html',
  styleUrl: './car-config-color-menu-color-item.component.scss'
})
export class CarConfigColorMenuColorItemComponent implements OnInit {
  readonly value = input<CarColorDto | undefined>(undefined);
  readonly isSelected = input<boolean>(false);
  readonly itemSelected = output<CarColorDto>();

  private readonly carConfigCommonInfoModal = inject(CarConfigCommonInfoModal);
  private readonly carConfigGeneralFunctionsService = inject(CarConfigGeneralFunctionsService);

  colorCodeHex = "00000";

  ngOnInit(): void {
    const val = this.value();
    if (val?.colorCodeHex) {
      this.colorCodeHex = val.colorCodeHex;
    }
  }

  onClick(): void {
    const val:CarColorDto | undefined = this.value();
    if (val) {
      this.itemSelected.emit(val);
    }
  }

  toCurrencyFormat(price: number | undefined) :string {
    if (price) {
      return this.carConfigGeneralFunctionsService.formatCurrency(price);
    }
    return "";
  }

  priceIsAvailable(value: CarColorDto | undefined) : boolean {
    return !!(value?.price && value.price > 0);
  }

  handleIconClick(eventObj: MouseEvent) : void {
    eventObj.stopPropagation();
    const val = this.value();
    if (val?.description) {
      let modalInfo = val?.colorName ?? "";
      modalInfo = "Info Color for " + modalInfo + ":";
      this.carConfigCommonInfoModal.open(modalInfo, val.description);
    }
  }
}
