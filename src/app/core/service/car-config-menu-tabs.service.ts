import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CarConfigMenuTabs} from '../models/CarConfigMenuTabs';

@Injectable({
  providedIn: 'root'
})
export class CarTabMenuChangeService {
  private readonly _carConfigTabInfoData = new BehaviorSubject<CarConfigMenuTabs>({});

  // Observable stream for components to subscribe to
  public carConfigTabInfoData$ = this._carConfigTabInfoData.asObservable();
  constructor() { }

  // Method to update the data and notify all subscribers
  updateTaStatus(carConfigMenuTabs: CarConfigMenuTabs): void {
    this._carConfigTabInfoData.next(carConfigMenuTabs);
  }
}
