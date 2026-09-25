import { Component, input, output, OnInit, inject } from '@angular/core';
import { CarColorDto } from  '@carconfig/api-client';
import { ColorviewCircle } from '@carconfig/car-ui';
import { CommonInfoModal } from '@carconfig/car-ui';
import { GeneralFunctionsService } from '@carconfig/shared';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-color-menu-color-item',
  imports: [
    ColorviewCircle,
    TranslocoModule
  ],
  templateUrl: './color-menu-color-item.component.html',
  styleUrl: './color-menu-color-item.component.scss'
})
export class ColorMenuColorItemComponent implements OnInit {
  readonly CarColorDto = CarColorDto;
  readonly value = input<CarColorDto | undefined>(undefined);
  readonly isSelected = input<boolean>(false);
  readonly itemSelected = output<CarColorDto>();

  private readonly carConfigCommonInfoModal = inject(CommonInfoModal);
  private readonly carConfigGeneralFunctionsService = inject(GeneralFunctionsService);
  private readonly transloco = inject(TranslocoService);

  colorCodeHex = '#d9e2ec';

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
      modalInfo = `${this.transloco.translate('colors.infoTitle')} ${modalInfo}`.trim();
      this.carConfigCommonInfoModal.open(modalInfo, val.description);
    }
  }
}
