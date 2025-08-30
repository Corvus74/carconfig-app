import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SpecialEquipmentDto} from '../../../../../../api';
import {
  CarConfigCommonInfoModal
} from '../../../../../../common/car-config-common-info-modal/car-config-common-info-modal';
import {CarConfigGeneralFunctionsService} from '../../../../../../service/car-config-general-functions.service';
import {formatCurrency} from '@angular/common';

@Component({
  selector: 'app-car-config-equipment-menu-item',
  imports: [],
  templateUrl: './car-config-equipment-menu-item.component.html',
  styleUrl: './car-config-equipment-menu-item.component.scss'
})
export class CarConfigEquipmentMenuItemComponent {

  @Input() title: string | undefined = '';
  @Input() description: string | undefined = '';
  @Input() specialEquipment: SpecialEquipmentDto | undefined = {};
  @Input() isSelected: boolean = false;
  @Output() carEngineSelected = new EventEmitter<any>();

  constructor(private readonly carConfigCommonInfoModal: CarConfigCommonInfoModal, private readonly carConfigGeneralFunctionsService: CarConfigGeneralFunctionsService) {
  }

  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return this.carConfigGeneralFunctionsService.formatCurrency(price);
    }
    return "inkl."

  }

  handleIconClick(eventObj: MouseEvent) {
    eventObj.stopPropagation();
    if (this.specialEquipment?.description) {
      let modalInfo = this.specialEquipment?.equipmentName ?? "";
      modalInfo = "Info engine for " + modalInfo + ":";
      this.carConfigCommonInfoModal.open(modalInfo, this.specialEquipment.description)
    }


  }

}
