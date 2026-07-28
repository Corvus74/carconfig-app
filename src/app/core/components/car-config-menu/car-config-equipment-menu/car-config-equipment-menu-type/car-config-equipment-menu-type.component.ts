import { Component, input, OnInit } from '@angular/core';
import { SpecialEquipmentDto } from '../../../../api';
import { CarConfigEquipmentMenuCategoryComponent } from './car-config-equipment-menu-category/car-config-equipment-menu-category.component';

@Component({
  selector: 'app-car-config-special-equipment-menu-type',
  imports: [
    CarConfigEquipmentMenuCategoryComponent
  ],
  templateUrl: './car-config-equipment-menu-type.component.html',
  styleUrl: './car-config-equipment-menu-type.component.scss'
})
export class CarConfigEquipmentMenuTypeComponent implements OnInit {
  readonly specialEquipmentListInit = input<SpecialEquipmentDto[]>([]);
  readonly titleName = input<string>('');

  specialEquipmentAirconList: SpecialEquipmentDto[] = [];
  specialEquipmentMultiMediaList: SpecialEquipmentDto[] = [];
  specialEquipmentSeatsList: SpecialEquipmentDto[] = [];
  specialEquipmentHeatingList: SpecialEquipmentDto[] = [];
  specialEquipmentNaviList: SpecialEquipmentDto[] = [];
  specialEquipmentSteeringWheelList: SpecialEquipmentDto[] = [];
  specialEquipmentMiscList: SpecialEquipmentDto[] = [];

  airconTitleName = "Aircon";
  multiMediaTitleName = "Multimedia";
  seatsTitleName = "Seats";
  heatingTitleName = "Heating";
  naviTitleName = "Navigation System";
  steeringWheelTitleName = "Steering Wheel";
  miscTitleName = "Misc";

  locationMenuShown = false;

  ngOnInit(): void {
    this.buildCategoryMenu();
  }

  showLocationMenu() {
    this.locationMenuShown = !this.locationMenuShown;
  }

  private buildCategoryMenu(): void {
    const initList = this.specialEquipmentListInit();
    if (!initList?.length) {
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

    for (const item of initList) {
      const targetList = item.categoryType ? categoryMap[item.categoryType] : undefined;
      if (targetList) {
        targetList.push(item);
      }
    }
  }
}
