import {Component, OnInit} from '@angular/core';
import {CarColorDto, CarEngineDto, CarRimDto, SpecialEquipmentDto} from '../../api';
import {CarConfigChangeService} from '../../service/car-config-change.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-car-config-car-information',
  imports: [],
  templateUrl: './car-config-car-information.component.html',
  styleUrl: './car-config-car-information.component.scss'
})
export class CarConfigCarInformationComponent implements OnInit{
  engineData :CarEngineDto | undefined;
  colorData:CarColorDto| undefined;
  rimData:CarRimDto| undefined;
  specialEquipment:SpecialEquipmentDto[] | undefined;
  private carEngineSubscription: Subscription | undefined;
  private carColorSubscription: Subscription | undefined;
  private carRimSubscription: Subscription | undefined;
  private carSpecialEquipmentSubscription: Subscription | undefined;
  constructor(private readonly carConfigChangedService:CarConfigChangeService) {
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
    this.carSpecialEquipmentSubscription = this.carConfigChangedService.specialEquiomentData$.subscribe(
      (data) => {
        this.specialEquipment = data;
      }
    );
  }

}
