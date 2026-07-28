import { Injectable, signal, effect, computed, inject } from '@angular/core';
import { CarConfigChangeService } from './car-config-change.service';
import { CarTabMenuChangeService } from './car-config-menu-tabs.service';
import { BaseConfigDto } from '../api';
import { CarConfigMenuTabs } from '../models/CarConfigMenuTabs';

@Injectable({ providedIn: 'root' })
export class CarConfigTabStore {
  readonly baseConfig = signal<BaseConfigDto | null>(null);
  readonly tabsStatus = signal<CarConfigMenuTabs>({ tabEngine: false, tabColor: false, tabRim: false, tabSpecialEquipment: false, activeTab: 1 });
  readonly activeTab = signal<number>(1);

  private readonly carConfigChangeService = inject(CarConfigChangeService);
  private readonly carTabMenuChangeService = inject(CarTabMenuChangeService);

  constructor() {
    // Watch external tab info and mirror locally
    effect(() => {
      const data = this.carTabMenuChangeService.carConfigTabInfoData();
      this.tabsStatus.set(data ?? {});
      const active = data?.activeTab;
      if (active !== undefined && active !== null) this.activeTab.set(active);
    });

    // Watch car config selections and unlock tabs accordingly
    effect(() => {
      const data = this.carConfigChangeService.engineData();
      if (data?.productId) this.markTabUnlocked('tabEngine');
    });
    effect(() => {
      const data = this.carConfigChangeService.colorData();
      if (data?.productId) this.markTabUnlocked('tabColor');
    });
    effect(() => {
      const data = this.carConfigChangeService.rimData();
      if (data?.productId) this.markTabUnlocked('tabRim');
    });
    effect(() => {
      const data = this.carConfigChangeService.specialEquipmentData();
      const equipmentFirstElem = data?.[0]?.productId;
      if (equipmentFirstElem) this.markTabUnlocked('tabSpecialEquipment');
    });
  }

  setBaseConfig(cfg: BaseConfigDto | null) {
    this.baseConfig.set(cfg);
  }

  selectTab(index: number) {
    this.activeTab.set(index);
    this.syncExternal();
  }

  private syncExternal() {
    // Push current tab status to external change service
    this.carTabMenuChangeService.updateTabStatus({ ...this.tabsStatus(), activeTab: this.activeTab() });
  }

  private markTabUnlocked(key: keyof CarConfigMenuTabs) {
    const ts = this.tabsStatus();
    if (!ts[key]) {
      const updated = { ...ts, [key]: true } as CarConfigMenuTabs;
      this.tabsStatus.set(updated);
      this.carTabMenuChangeService.updateTabStatus(updated);
    }
  }

  get maxUnlockedTabId(): number {
    const ts = this.tabsStatus();
    if (!ts.tabEngine) return 1;
    if (!ts.tabColor) return 2;
    if (!ts.tabRim) return 3;
    return 4;
  }

  canProceedFromActiveTab(): boolean {
    const ts = this.tabsStatus();
    switch (this.activeTab()) {
      case 1: return ts.tabEngine ?? false;
      case 2: return ts.tabColor ?? false;
      case 3: return ts.tabRim ?? false;
      case 4: return ts.tabSpecialEquipment ?? false;
      default: return false;
    }
  }

  goToNextTab(): void {
    if (this.canProceedFromActiveTab() && this.activeTab() < this.maxUnlockedTabId) {
      this.selectTab(this.activeTab() + 1);
    }
  }

  goToPreviousTab(): void {
    if (this.activeTab() > 1) this.selectTab(this.activeTab() - 1);
  }
}
