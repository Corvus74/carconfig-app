import { Component, input, OnInit } from '@angular/core';
import { SpecialEquipmentDto } from '../../../api';
import { CarConfigEquipmentMenuTypeComponent } from './car-config-equipment-menu-type/car-config-equipment-menu-type.component';

@Component({
  selector: 'app-car-config-special-equipment-menu',
  imports: [
    CarConfigEquipmentMenuTypeComponent
  ],
  templateUrl: './car-config-equipment-menu.component.html',
  styleUrl: './car-config-equipment-menu.component.scss'
})
export class CarConfigEquipmentMenuComponent implements OnInit {
  readonly specialEquipmentListInit = input<SpecialEquipmentDto[] | undefined>(undefined);

  specialEquipmentInteriorList: SpecialEquipmentDto[] = [];
  specialEquipmentExteriorList: SpecialEquipmentDto[] = [];
  titleInteriorEquipmentName: string = "Interior Equipment";
  titleExteriorEquipmentName: string = "Exterior Equipment";

  ngOnInit(): void {
    this.createLocationMenus();
  }

  createLocationMenus() {
    const list = this.specialEquipmentListInit();
    if (list) {
      for (let specialEquipment of list) {
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
