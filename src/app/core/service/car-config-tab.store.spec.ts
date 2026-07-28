import { TestBed } from '@angular/core/testing';
import { CarConfigTabStore } from './car-config-tab.store';
import { CarConfigChangeService } from './car-config-change.service';
import { CarTabMenuChangeService } from './car-config-menu-tabs.service';

describe('CarConfigTabStore', () => {
  let store: CarConfigTabStore;
  let changeSvc: CarConfigChangeService;
  let external: CarTabMenuChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CarConfigTabStore, CarConfigChangeService, CarTabMenuChangeService] });
    store = TestBed.inject(CarConfigTabStore);
    changeSvc = TestBed.inject(CarConfigChangeService);
    external = TestBed.inject(CarTabMenuChangeService);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should unlock engine tab when engineData updated', () => {
    expect(store.tabsStatus().tabEngine).toBeFalsy();
    changeSvc.updateEngineData({ productId: 'p1' } as any);
    expect(store.tabsStatus().tabEngine).toBeTrue();
  });

  it('selectTab updates activeTab and external service', () => {
    store.selectTab(3);
    expect(store.activeTab()).toBe(3);
    expect(external.carConfigTabInfoData().activeTab).toBe(3);
  });
});
