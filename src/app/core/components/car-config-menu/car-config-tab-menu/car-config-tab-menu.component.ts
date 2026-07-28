import { Component, ElementRef, input, OnInit, ViewChild, inject, signal, effect } from '@angular/core';
import { CarConfigColorMenuComponent } from "../car-config-color-menu/car-config-color-menu.component";
import { CarConfigEngineMenuComponent } from "../car-config-engine-menu/car-config-engine-menu.component";
import { CarConfigRimMenuComponent } from "../car-config-rim-menu/car-config-rim-menu.component";
import { CarConfigEquipmentMenuComponent } from "../car-config-equipment-menu/car-config-equipment-menu.component";
import { BaseConfigDto } from '../../../api';
import { CarTabMenuChangeService } from '../../../service/car-config-menu-tabs.service';
import { CarConfigMenuTabs } from '../../../models/CarConfigMenuTabs';
import { CarConfigChangeService } from '../../../service/car-config-change.service';

@Component({
  selector: 'app-car-config-tab-menu',
  imports: [
    CarConfigColorMenuComponent,
    CarConfigEngineMenuComponent,
    CarConfigRimMenuComponent,
    CarConfigEquipmentMenuComponent
  ],
  templateUrl: './car-config-tab-menu.component.html',
  styleUrl: './car-config-tab-menu.component.scss'
})
export class CarConfigTabMenuComponent implements OnInit {
  readonly baseConfig = input<BaseConfigDto>({});
  readonly tabsStatus = signal<CarConfigMenuTabs>({ tabEngine: false, tabColor: false, tabRim: false, tabSpecialEquipment: false, activeTab: 1 });
  @ViewChild('tabScroll') tabScroll?: ElementRef<HTMLElement>;

  private readonly carConfigChangeService = inject(CarConfigChangeService);
  private readonly carTabMenuChangeService = inject(CarTabMenuChangeService);

  // using effects instead of manual subscriptions

  activeTab = 1;

  // no manual unsubscribe needed when using effects

  ngOnInit(): void {
    effect(() => {
      const data = this.carConfigChangeService.engineData();
      if (data?.productId) this.onEngineSelected();
    });

    effect(() => {
      const data = this.carConfigChangeService.colorData();
      if (data?.productId) this.onColorSelected();
    });

    effect(() => {
      const data = this.carConfigChangeService.rimData();
      if (data?.productId) this.onRimsSelected();
    });

    effect(() => {
      const data = this.carConfigChangeService.specialEquipmentData();
      const equipmentFirstElem = data?.[0]?.productId;
      if (equipmentFirstElem) this.onSpecialSelected();
    });

    effect(() => {
      const data = this.carTabMenuChangeService.carConfigTabInfoData();
      this.tabsStatus.set(data ?? {});
      const active = data?.activeTab;
      if (active) this.activeTab = active;
    });
  }

  tabInfos = [
    { id: 1, label: 'Car Engine' },
    { id: 2, label: 'Car Color' },
    { id: 3, label: 'Car Rim' },
    { id: 4, label: 'Special Equipments' }
  ];

  selectTab(index: number): void {
    this.activeTab = index;
  }

  showCarEngine() {
    const config = this.baseConfig();
    return !!(config.carEngines && config.carEngines.length > 0);
  }

  showCarColor() {
    const config = this.baseConfig();
    return !!(config.carColors && config.carColors.length > 0);
  }

  showCarRims() {
    const config = this.baseConfig();
    return !!(config.carRims && config.carRims.length > 0);
  }

  showSpecialEquipment() {
    const config = this.baseConfig();
    return !!(config.specialEquipment && config.specialEquipment.length > 0);
  }

  get maxUnlockedTabId(): number {
    const ts = this.tabsStatus();
    if (!ts.tabEngine) return 1;
    if (!ts.tabColor) return 2;
    if (!ts.tabRim) return 3;
    return 4;
  }

  hasPreviousTab(): boolean {
    return this.activeTab > 1;
  }

  goToPreviousTab(): void {
    if (this.hasPreviousTab()) {
      this.selectTab(this.activeTab - 1);
      queueMicrotask(() => this.scrollToTop());
    }
  }

  canProceedFromActiveTab(): boolean {
    const ts = this.tabsStatus();
    switch (this.activeTab) {
      case 1: return ts.tabEngine ?? false;
      case 2: return ts.tabColor ?? false;
      case 3: return ts.tabRim ?? false;
      case 4: return ts.tabSpecialEquipment ?? false;
      default: return false;
    }
  }

  goToNextTab(): void {
    if (this.canProceedFromActiveTab() && this.activeTab < this.maxUnlockedTabId) {
      this.selectTab(this.activeTab + 1);
      queueMicrotask(() => this.scrollToTop());
    }
  }

  private scrollToTop(): void {
    const el = this.tabScroll?.nativeElement;
    if (!el) return;
    el.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private onEngineSelected(): void {
    const ts = this.tabsStatus();
    if (!ts.tabEngine) {
      const updated = { ...ts, tabEngine: true };
      this.tabsStatus.set(updated);
      this.carTabMenuChangeService.updateTabStatus(updated);
    }
  }

  private onColorSelected(): void {
    const ts = this.tabsStatus();
    if (!ts.tabColor) {
      const updated = { ...ts, tabColor: true };
      this.tabsStatus.set(updated);
      this.carTabMenuChangeService.updateTabStatus(updated);
    }
  }

  private onRimsSelected(): void {
    const ts = this.tabsStatus();
    if (!ts.tabRim) {
      const updated = { ...ts, tabRim: true };
      this.tabsStatus.set(updated);
      this.carTabMenuChangeService.updateTabStatus(updated);
    }
  }

  private onSpecialSelected(): void {
    const ts = this.tabsStatus();
    if (!ts.tabSpecialEquipment) {
      const updated = { ...ts, tabSpecialEquipment: true };
      this.tabsStatus.set(updated);
      this.carTabMenuChangeService.updateTabStatus(updated);
    }
  }
}
