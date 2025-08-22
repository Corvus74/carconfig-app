import {Component, OnInit} from '@angular/core';
import {CarConfigChangeService} from '../../service/car-config-change.service';
import {CarColorDto, CarEngineDto, CarRimDto, SpecialEquipmentDto} from '../../api';
import {Subscription} from 'rxjs';
import {formatCurrency} from '@angular/common';

@Component({
  selector: 'app-car-config-order',
  imports: [],
  templateUrl: './car-config-order.component.html',
  styleUrl: './car-config-order.component.scss'
})
export class CarConfigOrderComponent implements OnInit {
  engineData: CarEngineDto | undefined;
  colorData: CarColorDto| undefined;
  rimData: CarRimDto | undefined;
  specialEquipments: SpecialEquipmentDto[] | undefined;
  private carEngineSubscription: Subscription | undefined;
  private carColorSubscription: Subscription | undefined;
  private carRimSubscription: Subscription | undefined;
  private carSpecialEquipmentsSubscription: Subscription | undefined;

  protected totalPrice = 0

  constructor(private readonly carConfigChangedService: CarConfigChangeService) {
  }

  ngOnInit(): void {
    // Subscribe to the observable to get the latest data
    this.carEngineSubscription = this.carConfigChangedService.engineData$.subscribe(
      (data) => {
        this.engineData = data;
        this.calculatePriceComplete()
      }
    );
    this.carColorSubscription = this.carConfigChangedService.colorData$.subscribe(
      (data) => {
        this.colorData = data;
        this.calculatePriceComplete()
      }
    );

    this.carRimSubscription = this.carConfigChangedService.rimDataData$.subscribe(
      (data) => {
        this.rimData = data;
        this.calculatePriceComplete()
      }
    );
    this.carSpecialEquipmentsSubscription = this.carConfigChangedService.specialEquiomentData$.subscribe(
      (data) => {
        this.specialEquipments = data;
        this.calculatePriceComplete()
      }
    );
  }

  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return formatCurrency(price/100,"de-DE","€","EUR")
    }
    return ""
  }

  calculatePriceComplete() {
    this.totalPrice = 0;
    this.addEnginePrice();
    this.addColorPrice();
    this.addRimPrice();
    this.addSpecialEquipmentPrice();
  }

  private addSpecialEquipmentPrice() {
    if (this.specialEquipments && this.specialEquipments.length > 0) {
      for (const specialEquipment of this.specialEquipments) {
        if (specialEquipment.price) {
          this.totalPrice += specialEquipment.price
        }
      }
    }
  }

  private addRimPrice() {
    if (this.rimData) {
      if (this.rimData.price) {
        this.totalPrice += this.rimData.price
      }
    }
  }

  private addColorPrice() {
    if (this.colorData) {
      if (this.colorData.price) {
        this.totalPrice += this.colorData.price
      }
    }
  }

  private addEnginePrice() {
    if (this.engineData) {
      if (this.engineData.price) {
        this.totalPrice += this.engineData.price
      }
    }
  }
}
