import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() title: string | undefined = '';
  @Input() description: string | undefined = '';
  @Input() value: CarEngineDto |undefined ={};
  @Input() isSelected: boolean = false;
  @Output() carEngineSelected = new EventEmitter<any>();

  constructor(private readonly carConfigCommonInfoModal:CarConfigCommonInfoModal, private readonly carConfigGeneralFunctionsService: CarConfigGeneralFunctionsService) {
  }
  selectCarEngine(): void {
    this.carEngineSelected.emit(this.value);
  }

  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return this.carConfigGeneralFunctionsService.formatCurrency(price);
    }
    return ""

  }

  handleIconClick(eventObj: MouseEvent) {
    eventObj.stopPropagation();
    if(this.value?.description){
      let modalInfo =this.value?.model ?? "";
      modalInfo = "Info engine for " + modalInfo + ":";
      this.carConfigCommonInfoModal.open(modalInfo,this.value.description)
    }


  }
}
