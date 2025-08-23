import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CarEngineDto} from '../../../../api';
import {formatCurrency} from '@angular/common';

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
  @Output() itemSelected = new EventEmitter<any>();

  onClick(): void {
    this.itemSelected.emit(this.value);
  }

  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return formatCurrency(price/100,"de-DE","€","EUR")
    }
    return ""

  }
}
