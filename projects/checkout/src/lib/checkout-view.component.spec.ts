import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CarColorDto, CarEngineDto, CarRimDto, OrderControllerService, SpecialEquipmentDto } from '@carconfig/api-client';
import { CarConfigStoreService, CarTabMenuChangeService } from '@carconfig/car-state';
import { ApiService, GeneralFunctionsService } from '@carconfig/shared';
import { TranslocoService } from '@jsverse/transloco';
import { OrderModal } from '@carconfig/checkout';
import { CheckoutViewComponent } from '@carconfig/checkout';

describe('CheckoutViewComponent', () => {
  let fixture: ComponentFixture<CheckoutViewComponent>;
  let store: {
    engine: WritableSignal<CarEngineDto | null>;
    color: WritableSignal<CarColorDto | null>;
    rims: WritableSignal<CarRimDto | null>;
    specialEquipment: WritableSignal<SpecialEquipmentDto[]>;
    reset: jasmine.Spy;
  };
  let createOrder: jasmine.Spy;
  let openModal: jasmine.Spy;
  let returnToConfigurator: jasmine.Spy;

  beforeEach(async () => {
    store = {
      engine: signal({ productId: 'engine-1', price: 32000 } as CarEngineDto),
      color: signal({ productId: 'color-1', price: 0 } as CarColorDto),
      rims: signal({ productId: 'rim-1', price: 1200 } as CarRimDto),
      specialEquipment: signal([
        { productId: 'equipment-1', price: 450 } as SpecialEquipmentDto,
      ]),
      reset: jasmine.createSpy('reset'),
    };
    createOrder = jasmine.createSpy('createOrder').and.returnValue(of({ orderId: 'order-42' }));
    openModal = jasmine.createSpy('open').and.resolveTo(true);
    returnToConfigurator = jasmine.createSpy('returnToConfigurator');

    await TestBed.configureTestingModule({
      imports: [CheckoutViewComponent],
      providers: [
        { provide: CarConfigStoreService, useValue: store },
        { provide: CarTabMenuChangeService, useValue: { carConfigTabInfoData: signal({ tabRim: true }), returnToConfigurator } },
        { provide: OrderControllerService, useValue: { createOrder } },
        { provide: OrderModal, useValue: { open: openModal } },
        { provide: GeneralFunctionsService, useValue: { formatCurrency: (price: number) => `${price}` } },
        { provide: ApiService, useValue: { getApiOrderUrl: () => '/order', getApiProductUrl: () => '/product' } },
        { provide: Router, useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') } },
        { provide: TranslocoService, useValue: { translate: (key: string) => key } },
      ],
    })
      .overrideComponent(CheckoutViewComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(CheckoutViewComponent);
    fixture.detectChanges();
  });

  it('builds order lines and total from the current selections', () => {
    const component = fixture.componentInstance;

    expect(component.totalPrice()).toBe(33650);
    expect(component.orderLines().map(line => line.id)).toEqual([
      'engine-1', 'color-1', 'rim-1', 'equipment-1',
    ]);
    expect(component.orderLines().map(line => line.position)).toEqual([1, 2, 3, 4]);
  });

  it('submits the selected product IDs and returns to the configurator after confirmation', async () => {
    await fixture.componentInstance.onOrderConfirmClick();

    expect(createOrder).toHaveBeenCalledOnceWith({
      carEngineProductId: 'engine-1',
      carColorProductId: 'color-1',
      carRimsProductId: 'rim-1',
      specialEquipmentProductIds: ['equipment-1'],
    });
    expect(returnToConfigurator).toHaveBeenCalledOnceWith();
    expect(openModal).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.receivedOrderLink()).toBeTrue();
    expect(fixture.componentInstance.isSending).toBeFalse();
  });
});
