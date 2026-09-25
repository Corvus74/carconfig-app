import { Component, input, output, inject } from '@angular/core';
import { CarRimDto } from  '@carconfig/api-client';
import { GeneralFunctionsService } from '@carconfig/shared';
import { CommonInfoModal } from '@carconfig/car-ui';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-rim-menu-item',
  imports: [TranslocoModule],
  templateUrl: './rim-menu-item.component.html',
  styleUrl: './rim-menu-item.component.scss'
})
export class RimMenuItemComponent {
  readonly value = input<CarRimDto>({});
  readonly isSelected = input<boolean>(false);
  readonly itemSelected = output<CarRimDto>();

  private readonly carConfigGeneralFunctionsService = inject(GeneralFunctionsService);
  private readonly carConfigCommonInfoModal = inject(CommonInfoModal);
  private readonly transloco = inject(TranslocoService);

  onClick(): void {
    this.itemSelected.emit(this.value());
  }

  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return this.carConfigGeneralFunctionsService.formatCurrency(price);
    }
    return this.transloco.translate('common.includedShort');
  }

  getImage(innerDiameter: number | undefined) {
    if(innerDiameter) {
      if (innerDiameter <= 17) {
        return "assets/felge_01.png";
      }
      if (innerDiameter > 17) {
        return "assets/felge_02.png.webp";
      }
    }
    return "assets/felge_01.png";
  }

  handleIconClick(eventObj: MouseEvent) {
    eventObj.stopPropagation();
    const val = this.value();
    if (val?.description) {
      let modalInfo = val?.model ?? "";
      modalInfo = `${this.transloco.translate('rims.infoTitle')} ${modalInfo}`;
      this.carConfigCommonInfoModal.open(modalInfo, val.description);
    }
  }
}
