import {Component, OnInit, effect} from '@angular/core';
import {CarColorDto, CarEngineDto, CarRimDto, SpecialEquipmentDto} from '../../api';
import {CarConfigChangeService} from '../../service/car-config-change.service';
import {CarTabMenuChangeService} from '../../service/car-config-menu-tabs.service';
import {CarConfigMenuTabs} from '../../models/CarConfigMenuTabs';

@Component({
  selector: 'app-car-config-car-information',
  imports: [],
  templateUrl: './car-config-car-information.component.html',
  styleUrl: './car-config-car-information.component.scss'
})
export class CarConfigCarInformationComponent implements OnInit {
  engineData: CarEngineDto | undefined;
  colorData: CarColorDto | undefined;
  rimData: CarRimDto | undefined;
  specialEquipment: SpecialEquipmentDto[] | undefined;
  carMenuTabs: CarConfigMenuTabs  | undefined;
  // using effects instead of manual subscriptions

  constructor(private readonly carConfigChangedService: CarConfigChangeService,
              private readonly carTabMenuChangeService: CarTabMenuChangeService) {
    // use signals via effects to keep local fields in sync
    effect(() => {
      this.engineData = this.carConfigChangedService.engineData();
    });
    effect(() => {
      this.colorData = this.carConfigChangedService.colorData();
    });
    effect(() => {
      this.rimData = this.carConfigChangedService.rimData();
    });
    effect(() => {
      this.specialEquipment = this.carConfigChangedService.specialEquipmentData();
    });
    effect(() => {
      this.carMenuTabs = this.carTabMenuChangeService.carConfigTabInfoData();
    });
  }

  ngOnInit(): void {
  }


  showSpecialEquipment() {
    if (this.specialEquipment) {
      return this.specialEquipment[0].productId
    }
    return false;
  }

  generateChoosenText() {
    return "( " + this.specialEquipment?.length + " of 5 Equipments selected)";
  }

  showCarInfo() {
    return !this.carMenuTabs?.showOrder;
  }

  showFinishedOrder() {
    return this.carMenuTabs?.tabSpecialEquipment;
  }

  onEarlyFinishedOrder() {
    if(this.carMenuTabs){
      this.carMenuTabs.showOrder = true;
      this.carTabMenuChangeService.updateTabStatus(this.carMenuTabs)
    }

  }
}
