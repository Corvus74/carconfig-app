import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { CarConfigTabStore } from './car-config-tab.store';
import { CarTabMenuChangeService } from '@carconfig/car-state';
import {CarConfigStoreService} from '@carconfig/car-state';
import {CarEngineDto} from '@carconfig/api-client';

describe('CarConfigTabStore', () => {
  let store: CarConfigTabStore;
  let configStoreSvc: CarConfigStoreService;
  let tabMenuSvc: CarTabMenuChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CarConfigTabStore, CarConfigStoreService, CarTabMenuChangeService] });
    store = TestBed.inject(CarConfigTabStore);
    configStoreSvc = TestBed.inject(CarConfigStoreService);
    tabMenuSvc = TestBed.inject(CarTabMenuChangeService);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });


  it('should unlock engine tab when engineData updated', fakeAsync(() => {
    expect(store.tabsStatus().tabEngine).toBeFalsy();
    configStoreSvc.updateEngine({ productId: 'p1' } as CarEngineDto);
    flush(); // Flush all pending micro/macro tasks including effects
    TestBed.flushEffects(); // Ensure all Angular effects complete
    expect(store.tabsStatus().tabEngine).toBeTrue();
  }));

  it('selectTab updates activeTab and external service', () => {
    store.selectTab(3);
    expect(store.activeTab()).toBe(3);
    expect(tabMenuSvc.carConfigTabInfoData().activeTab).toBe(3);
  });

  it('unlocks configuration steps in order and blocks progress until the next choice exists', fakeAsync(() => {
    expect(store.maxUnlockedTabId).toBe(1);
    expect(store.canProceedFromActiveTab()).toBeFalse();

    configStoreSvc.updateEngine({ productId: 'engine-1' } as CarEngineDto);
    TestBed.flushEffects();
    expect(store.maxUnlockedTabId).toBe(2);
    expect(store.canProceedFromActiveTab()).toBeTrue();

    store.goToNextTab();
    expect(store.activeTab()).toBe(2);
    expect(store.canProceedFromActiveTab()).toBeFalse();
    store.goToNextTab();
    expect(store.activeTab()).toBe(2);

    configStoreSvc.updateColor({ productId: 'color-1' });
    TestBed.flushEffects();
    expect(store.canProceedFromActiveTab()).toBeTrue();
    store.goToNextTab();
    expect(store.activeTab()).toBe(3);
  }));

  it('returns to the first step after the configuration is reset', fakeAsync(() => {
    configStoreSvc.updateEngine({ productId: 'engine-1' } as CarEngineDto);
    configStoreSvc.updateColor({ productId: 'color-1' });
    TestBed.flushEffects();
    store.selectTab(2);

    configStoreSvc.reset();
    tabMenuSvc.reset();
    TestBed.flushEffects();

    expect(store.activeTab()).toBe(1);
    expect(store.maxUnlockedTabId).toBe(1);
    expect(store.canProceedFromActiveTab()).toBeFalse();
  }));
});
