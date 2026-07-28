import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CarEngineDto } from '../api/model/carEngineDto';
import { CarColorDto } from '../api/model/carColorDto';
import { SpecialEquipmentDto } from '../api/model/specialEquipmentDto';
import { CarRimDto } from '../api/model/carRimDto';

@Injectable({
  providedIn: 'root'
})
export class CarConfigChangeService {
  readonly engineData = signal<CarEngineDto>({});
  readonly colorData = signal<CarColorDto>({});
  readonly rimData = signal<CarRimDto>({});
  readonly specialEquipmentData = signal<SpecialEquipmentDto[]>([{}]);

  public engineData$ = toObservable(this.engineData);
  public colorData$ = toObservable(this.colorData);
  public rimDataData$ = toObservable(this.rimData);
  public specialEquipmentData$ = toObservable(this.specialEquipmentData);

  updateEngineData(engineData: CarEngineDto): void {
    this.engineData.set(engineData);
  }

  updateCarColorData(data: CarColorDto): void {
    this.colorData.set(data);
  }

  updateCarRimData(data: CarRimDto): void {
    this.rimData.set(data);
  }

  updateSpecialEquipmentData(data: SpecialEquipmentDto[]): void {
    this.specialEquipmentData.set(data);
  }

  reset(): void {
    this.engineData.set({});
    this.colorData.set({});
    this.rimData.set({});
    this.specialEquipmentData.set([{}]);
  }
}
