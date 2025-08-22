import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CarRimDto} from '../../../../api';

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

  onClick(): void {
    this.itemSelected.emit(this.value);
  }
}
