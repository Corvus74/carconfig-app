import {Component, Input, OnInit} from '@angular/core';
import {SpecialEquipmentDto} from '../../../../api';
import {
  CarConfigEquipmentMenuCategoryComponent
} from './car-config-equipment-menu-category/car-config-equipment-menu-category.component';

@Component({
  selector: 'app-car-config-special-equipment-menu-type',
  imports: [
    CarConfigEquipmentMenuCategoryComponent

  ],
  templateUrl: './car-config-equipment-menu-type.component.html',
  styleUrl: './car-config-equipment-menu-type.component.scss'
})
export class CarConfigEquipmentMenuTypeComponent implements OnInit {
  @Input() specialEquipmentListInit!: SpecialEquipmentDto[];
  @Input() titleName!: string;
  specialEquipmentAirconList: SpecialEquipmentDto[] = [];
  specialEquipmentMultiMediaList: SpecialEquipmentDto[] = [];
  specialEquipmentSeatsList: SpecialEquipmentDto[] = [];
  specialEquipmentHeatingList: SpecialEquipmentDto[] = [];
  specialEquipmentNaviList: SpecialEquipmentDto[] = [];
  specialEquipmentSteeringWheelList: SpecialEquipmentDto[] = [];
  specialEquipmentMiscList: SpecialEquipmentDto[] = [];
  airconTitleName: string ="Aircon";
  multiMediaTitleName: string="Multimedia";
  seatsTitleName: string="Seats";
  heatingTitleName: string="Heating";
  naviTitleName: string="Navigation System";
  steeringWheelTitleName: string="Steering Wheel";
  miscTitleName: string="Misc";
  locationMenuShown: boolean=false;
  ngOnInit(): void {
    this.buildCategoryMenu();
  }

  showLocationMenu(){
    this.locationMenuShown = !this.locationMenuShown;
  }

  private buildCategoryMenu(): void {
    if (!this.specialEquipmentListInit?.length) {
      return;
    }

    const categoryMap: Record<SpecialEquipmentDto.CategoryTypeEnum, SpecialEquipmentDto[]> = {
      [SpecialEquipmentDto.CategoryTypeEnum.AirCondition]: this.specialEquipmentAirconList,
      [SpecialEquipmentDto.CategoryTypeEnum.Multimedia]: this.specialEquipmentMultiMediaList,
      [SpecialEquipmentDto.CategoryTypeEnum.Seats]: this.specialEquipmentSeatsList,
      [SpecialEquipmentDto.CategoryTypeEnum.Heating]: this.specialEquipmentHeatingList,
      [SpecialEquipmentDto.CategoryTypeEnum.NavigationSystem]: this.specialEquipmentNaviList,
      [SpecialEquipmentDto.CategoryTypeEnum.SteeringWheel]: this.specialEquipmentSteeringWheelList,
      [SpecialEquipmentDto.CategoryTypeEnum.Misc]: this.specialEquipmentMiscList
    };

    for (const item of this.specialEquipmentListInit) {
      const targetList = item.categoryType ? categoryMap[item.categoryType] : undefined;
      if (targetList) {
        targetList.push(item);
      }
    }
  }
}
