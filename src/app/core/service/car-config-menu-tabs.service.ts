import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CarConfigMenuTabs } from '../models/CarConfigMenuTabs';

@Injectable({
  providedIn: 'root'
})
export class CarTabMenuChangeService {
  readonly carConfigTabInfoData = signal<CarConfigMenuTabs>({});

  public carConfigTabInfoData$ = toObservable(this.carConfigTabInfoData);

  updateTabStatus(carConfigMenuTabs: CarConfigMenuTabs): void {
    this.carConfigTabInfoData.set(carConfigMenuTabs);
  }

  reset(): void {
    this.carConfigTabInfoData.set({});
  }
}
