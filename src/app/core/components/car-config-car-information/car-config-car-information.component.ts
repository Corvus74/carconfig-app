import {Component, OnDestroy, OnInit} from '@angular/core';
import {CarColorDto, CarEngineDto, CarRimDto, SpecialEquipmentDto} from '../../api';
import {CarConfigChangeService} from '../../service/car-config-change.service';
import {Subscription} from 'rxjs';
import {CarTabMenuChangeService} from '../../service/car-config-menu-tabs.service';
import {CarConfigMenuTabs} from '../../models/CarConfigMenuTabs';

@Component({
  selector: 'app-car-config-car-information',
  imports: [],
  templateUrl: './car-config-car-information.component.html',
  styleUrl: './car-config-car-information.component.scss'
})
export class CarConfigCarInformationComponent implements OnInit, OnDestroy {
  engineData: CarEngineDto | undefined;
  colorData: CarColorDto | undefined;
  rimData: CarRimDto | undefined;
  specialEquipment: SpecialEquipmentDto[] | undefined;
  carMenuTabs: CarConfigMenuTabs  | undefined;
  private carEngineSubscription: Subscription | undefined;
  private carColorSubscription: Subscription | undefined;
  private carRimSubscription: Subscription | undefined;
  private carSpecialEquipmentSubscription: Subscription | undefined;
  private carTabMenuChangeSubscription: Subscription | undefined;

  constructor(private readonly carConfigChangedService: CarConfigChangeService,
              private readonly carTabMenuChangeService: CarTabMenuChangeService) {
  }

  ngOnInit(): void {
    // Subscribe to the observable to get the latest data
    this.carEngineSubscription = this.carConfigChangedService.engineData$.subscribe(
      (data) => {
        this.engineData = data;
      }
    );
    this.carColorSubscription = this.carConfigChangedService.colorData$.subscribe(
      (data) => {
        this.colorData = data;
      }
    );

    this.carRimSubscription = this.carConfigChangedService.rimDataData$.subscribe(
      (data) => {
        this.rimData = data;
      }
    );
    this.carSpecialEquipmentSubscription = this.carConfigChangedService.specialEquipmentData$.subscribe(
      (data) => {
        this.specialEquipment = data;
      }
    );
    this.carTabMenuChangeSubscription = this.carTabMenuChangeService.carConfigTabInfoData$.subscribe(
      (data) => {
        this.carMenuTabs = data;
      }
    )
  }

  ngOnDestroy(): void {
      this.carEngineSubscription?.unsubscribe();
      this.carColorSubscription?.unsubscribe();
      this.carRimSubscription?.unsubscribe();
      this.carSpecialEquipmentSubscription?.unsubscribe();
      this.carTabMenuChangeSubscription?.unsubscribe();

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
