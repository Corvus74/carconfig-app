import { Service, inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { CarEngineDto, CarColorDto, CarRimDto, SpecialEquipmentDto } from '../api';

export interface CarConfigState {
  engine: CarEngineDto | null;
  color: CarColorDto | null;
  rims: CarRimDto | null;
  specialEquipment: SpecialEquipmentDto[];
}

const initialState: CarConfigState = {
  engine: null,
  color: null,
  rims: null,
  specialEquipment: [],
};

export const CarConfigStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    updateEngine(engine: CarEngineDto): void {
      patchState(store, { engine });
    },
    updateColor(color: CarColorDto): void {
      patchState(store, { color });
    },
    updateRims(rims: CarRimDto): void {
      patchState(store, { rims });
    },
    updateSpecialEquipment(specialEquipment: SpecialEquipmentDto[]): void {
      patchState(store, { specialEquipment });
    },
    reset(): void {
      patchState(store, initialState);
    },
  }))
);

@Service()
export class CarConfigStoreService {
  readonly store = inject(CarConfigStore);

  readonly engine = this.store.engine;
  readonly color = this.store.color;
  readonly rims = this.store.rims;
  readonly specialEquipment = this.store.specialEquipment;


  updateEngine(engine: CarEngineDto): void {
    this.store.updateEngine(engine);
  }

  updateColor(color: CarColorDto): void {
    this.store.updateColor(color);
  }

  updateRims(rims: CarRimDto): void {
    this.store.updateRims(rims);
  }

  updateSpecialEquipment(specialEquipment: SpecialEquipmentDto[]): void {
    this.store.updateSpecialEquipment(specialEquipment);
  }

  reset(): void {
    this.store.reset();
  }
}
