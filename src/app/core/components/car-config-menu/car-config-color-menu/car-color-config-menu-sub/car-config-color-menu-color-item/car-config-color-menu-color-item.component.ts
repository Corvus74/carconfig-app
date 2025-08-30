import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CarColorDto} from '../../../../../api';
import {CarConfigColorviewCircle} from '../../../../../common/car-config-colorview-circle/car-config-colorview-circle';
import {formatCurrency} from '@angular/common';
import {
  CarConfigCommonInfoModal
} from '../../../../../common/car-config-common-info-modal/car-config-common-info-modal';
import {CarConfigGeneralFunctionsService} from '../../../../../service/car-config-general-functions.service';

@Component({
  selector: 'app-car-config-color-menu-color-item',
  imports: [
    CarConfigColorviewCircle
  ],
  templateUrl: './car-config-color-menu-color-item.component.html',
  styleUrl: './car-config-color-menu-color-item.component.scss'
})
export class CarConfigColorMenuColorItemComponent implements OnInit {

  @Input() value: CarColorDto | undefined;
  @Input() isSelected: boolean = false;
  @Output() itemSelected = new EventEmitter<CarColorDto>();

  colorCodeHex: string = "00000"

  constructor(private readonly carConfigCommonInfoModal:CarConfigCommonInfoModal, private readonly carConfigGeneralFunctionsService:CarConfigGeneralFunctionsService) {
  }
  ngOnInit(): void {
    if (this.value) {
      if (this.value.colorCodeHex) {
        this.colorCodeHex = this.value.colorCodeHex;
      }
    }
  }

  onClick(): void {
    this.itemSelected.emit(this.value);
  }

  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return this.carConfigGeneralFunctionsService.formatCurrency(price)
    }
    return ""
  }

  priceIsAvailable(value: CarColorDto | undefined) {
    if(value){
      if(value.price){
        return value.price > 0
      }
    }
    return false;
  }
  showInfo = false;


  handleIconClick(eventObj: MouseEvent) {
    eventObj.stopPropagation();
    if (this.value?.description) {
      let modalInfo = this.value?.colorName ?? "";
      modalInfo = "Info Color for " + modalInfo + ":";
      this.carConfigCommonInfoModal.open(modalInfo, this.value.description)
    }
  }
}
