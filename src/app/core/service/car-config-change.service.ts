import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CarEngineDto} from '../api/model/carEngineDto';
import {CarColorDto} from '../api/model/carColorDto';
import {SpecialEquipmentDto} from '../api/model/specialEquipmentDto';
import {CarRimDto} from '../api/model/carRimDto';

@Injectable({
  providedIn: 'root'
})
export class CarConfigChangeService {
  private _engineData = new BehaviorSubject<CarEngineDto>({});
  private _colorData = new BehaviorSubject<CarColorDto>({});
  private _rimData = new BehaviorSubject<CarRimDto>({});
  private _specialEquipmentData = new BehaviorSubject<SpecialEquipmentDto[]>([{}]);

  // Observable stream for components to subscribe to
  public engineData$ = this._engineData.asObservable();
  public colorData$ = this._colorData.asObservable();
  public rimDataData$ = this._rimData.asObservable();
  public specialEquiomentData$ = this._specialEquipmentData.asObservable();

  constructor() { }

  // Method to update the data and notify all subscribers
  updateEngineData(engineData: CarEngineDto): void {
    this._engineData.next(engineData);
  }
  updateCarColorData(data: CarColorDto): void {
    this._colorData.next(data);
  }
  updateCarRimData(data: CarRimDto): void {
    this._rimData.next(data);
  }
  updateSpecialEquipmentData(data: SpecialEquipmentDto[]): void {
    this._specialEquipmentData.next(data);
  }
}
