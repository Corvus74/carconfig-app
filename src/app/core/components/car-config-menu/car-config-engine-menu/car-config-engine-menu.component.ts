import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CarEngineDto} from '../../../api';
import {CarConfigEngineMenuItemComponent} from '../../car-config-forms/car-config-engine-menu-item/car-config-engine-menu-item.component';

@Component({
  selector: 'app-car-config-engine-menu',
  imports: [
    CarConfigEngineMenuItemComponent
  ],
  templateUrl: './car-config-engine-menu.component.html',
  styleUrl: './car-config-engine-menu.component.scss'
})
export class CarConfigEngineMenuComponent {
  @Input() carEngines: CarEngineDto[] | undefined
  @Input() selectedValue: any;
  @Output() selectedValueChange = new EventEmitter<any>();

  onItemSelected(value: any): void {
    this.selectedValue = value;
    this.selectedValueChange.emit(this.selectedValue);
  }
}
