import {Component, Input} from '@angular/core';
import {SpecialEquipmentDto} from '../../../api';

@Component({
  selector: 'app-car-config-special-equipment-menu',
  imports: [],
  templateUrl: './car-config-special-equipment-menu.component.html',
  styleUrl: './car-config-special-equipment-menu.component.scss'
})
export class CarConfigSpecialEquipmentMenuComponent {
  @Input() specialEquipment: SpecialEquipmentDto[] | undefined
}
