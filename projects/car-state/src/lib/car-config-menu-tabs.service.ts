import { Service, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CarConfigMenuTabs } from './car-config-menu-tabs';

@Service()
export class CarTabMenuChangeService {
  readonly carConfigTabInfoData = signal<CarConfigMenuTabs>({});
  readonly orderReviewMode = signal(false);

  public carConfigTabInfoData$ = toObservable(this.carConfigTabInfoData);

  updateTabStatus(carConfigMenuTabs: CarConfigMenuTabs): void {
    this.carConfigTabInfoData.set(carConfigMenuTabs);
  }

  showOrderReview(): void {
    this.orderReviewMode.set(true);
  }

  returnToConfigurator(): void {
    this.orderReviewMode.set(false);
  }

  reset(): void {
    this.carConfigTabInfoData.set({});
    this.returnToConfigurator();
  }
}
