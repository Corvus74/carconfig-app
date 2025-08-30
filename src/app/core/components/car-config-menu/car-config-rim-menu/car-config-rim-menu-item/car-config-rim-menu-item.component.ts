import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CarRimDto} from '../../../../api';
import {formatCurrency} from '@angular/common';
import {CarConfigGeneralFunctionsService} from '../../../../service/car-config-general-functions.service';
import {CarConfigCommonInfoModal} from '../../../../common/car-config-common-info-modal/car-config-common-info-modal';

@Component({
  selector: 'app-car-config-rim-menu-item',
  imports: [],
  templateUrl: './car-config-rim-menu-item.component.html',
  styleUrl: './car-config-rim-menu-item.component.scss'
})
export class CarConfigRimMenuItemComponent {
  @Input() value: CarRimDto={};
  @Input() isSelected: boolean = false;
  @Output() itemSelected = new EventEmitter<CarRimDto>();

  constructor(private readonly carConfigGeneralFunctionsService: CarConfigGeneralFunctionsService, private readonly carConfigCommonInfoModal:CarConfigCommonInfoModal) {
  }

  onClick(): void {
    this.itemSelected.emit(this.value);
  }

  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return this.carConfigGeneralFunctionsService.formatCurrency(price);
    }
    return "inkl."
  }

  getImage(innerDiameter: number | undefined) {
    const diameter = innerDiameter ?? 17;
    if(diameter == 17) {
      return "assets/felge_01.png";
    }else{
      return "assets/felge_02.png.webp";
    }
  }

  handleIconClick(eventObj: MouseEvent) {
    eventObj.stopPropagation();
    if (this.value?.description) {
      let modalInfo = this.value?.model ?? "";
      modalInfo = "Info engine for " + modalInfo + ":";
      this.carConfigCommonInfoModal.open(modalInfo, this.value.description)
    }
  }
}
