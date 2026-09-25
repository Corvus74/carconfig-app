import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarInformationComponent } from './car-information.component';
import { signal } from '@angular/core';
import { CarConfigStoreService, CarTabMenuChangeService } from '@carconfig/car-state';
import { GeneralFunctionsService } from '@carconfig/shared';
import { CarColorDto, CarEngineDto, CarRimDto, SpecialEquipmentDto } from '@carconfig/api-client';

describe('CarInformationComponent', () => {
  let component: CarInformationComponent;
  let fixture: ComponentFixture<CarInformationComponent>;

  beforeEach(async () => {
    const store = {
      engine: signal<CarEngineDto | null>({ productId: 'engine-1', model: 'E-Drive', price: 32000 }),
      color: signal<CarColorDto | null>({ productId: 'color-1', colorName: 'Ocean Blue', price: 0 }),
      rims: signal<CarRimDto | null>({ productId: 'rim-1', rimName: 'Aero', price: 1200 }),
      specialEquipment: signal<SpecialEquipmentDto[]>([{ productId: 'eq-1', equipmentName: 'Navigation', price: 900 }]),
    };
    await TestBed.configureTestingModule({
      imports: [CarInformationComponent],
      providers: [
        { provide: CarConfigStoreService, useValue: store },
        { provide: CarTabMenuChangeService, useValue: { carConfigTabInfoData: signal({ showOrder: false }) } },
        { provide: GeneralFunctionsService, useValue: { formatCurrency: (price: number) => `${price}` } },
      ],
    })
    .overrideComponent(CarInformationComponent, { set: { template: '' } })
    .compileComponents();

    fixture = TestBed.createComponent(CarInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('summarizes selected products and calculates their total price', () => {
    expect(component.selectedItems().map(item => item.label)).toEqual([
      'config.engine', 'config.color', 'config.rims', 'config.equipment',
    ]);
    expect(component.totalPrice()).toBe(34100);
    expect(component.formattedTotalPrice()).toBe('34100');
  });
});
