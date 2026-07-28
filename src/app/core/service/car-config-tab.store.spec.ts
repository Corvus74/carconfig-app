import { TestBed, fakeAsync, flush, waitForAsync } from '@angular/core/testing';
import { CarConfigTabStore } from './car-config-tab.store';;
import { CarTabMenuChangeService } from './car-config-menu-tabs.service';
import {CarConfigStoreService} from './car-config-store.service';
import {CarEngineDto} from '../api';

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
});
