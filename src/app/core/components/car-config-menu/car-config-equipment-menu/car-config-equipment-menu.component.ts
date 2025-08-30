import {Component, Input, OnInit} from '@angular/core';
import {SpecialEquipmentDto} from '../../../api';
import {
  CarConfigEquipmentMenuTypeComponent
} from './car-config-equipment-menu-type/car-config-equipment-menu-type.component';


@Component({
  selector: 'app-car-config-special-equipment-menu',
  imports: [
    CarConfigEquipmentMenuTypeComponent
  ],
  templateUrl: './car-config-equipment-menu.component.html',
  styleUrl: './car-config-equipment-menu.component.scss'
})
export class CarConfigEquipmentMenuComponent implements OnInit {
  @Input() specialEquipmentListInit: SpecialEquipmentDto[] | undefined
  specialEquipmentInteriorList: SpecialEquipmentDto[] = [];
  specialEquipmentExteriorList: SpecialEquipmentDto[] = [];
  titleInteriorEquipmentName: string="Interior Equipment";
  titleExteriorEquipmentName: string="Exterior Equipment";
  ngOnInit(): void {
    this.createLocationMenus()
  }

  createLocationMenus() {
    if (this.specialEquipmentListInit) {
      for (let specialEquipment of this.specialEquipmentListInit) {
        if (specialEquipment.equipmentLocation === SpecialEquipmentDto.EquipmentLocationEnum.Interior) {
          this.specialEquipmentInteriorList.push(specialEquipment);
        }
        if (specialEquipment.equipmentLocation === SpecialEquipmentDto.EquipmentLocationEnum.Exterior) {
          this.specialEquipmentExteriorList.push(specialEquipment);
        }
      }
    }
  }
}
