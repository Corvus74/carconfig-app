import { Component, ElementRef, Input, OnInit, ViewChild, inject, signal, effect } from '@angular/core';
import { CarConfigColorMenuComponent } from "../car-config-color-menu/car-config-color-menu.component";
import { CarConfigEngineMenuComponent } from "../car-config-engine-menu/car-config-engine-menu.component";
import { CarConfigRimMenuComponent } from "../car-config-rim-menu/car-config-rim-menu.component";
import { CarConfigEquipmentMenuComponent } from "../car-config-equipment-menu/car-config-equipment-menu.component";
import { BaseConfigDto } from '../../../api';
import { CarConfigTabStore } from '../../../service/car-config-tab.store';
import { CarConfigMenuTabs } from '../../../models/CarConfigMenuTabs';

@Component({
  selector: 'app-car-config-tab-menu',
  imports: [
    CarConfigColorMenuComponent,
    CarConfigEngineMenuComponent,
    CarConfigRimMenuComponent,
    CarConfigEquipmentMenuComponent
  ],
  templateUrl: './car-config-tab-menu.component.html',
  styleUrls: ['./car-config-tab-menu.component.scss']
})
export class CarConfigTabMenuComponent implements OnInit {
  readonly tabStore = inject(CarConfigTabStore);

  @Input('baseConfig') set baseConfigInput(value: BaseConfigDto | null) { this.tabStore.setBaseConfig(value); }

  @ViewChild('tabScroll') tabScroll?: ElementRef<HTMLElement>;

  // active tab getter
  get activeTab() { return this.tabStore.activeTab(); }
  get tabsStatus() { return this.tabStore.tabsStatus(); }
  get baseConfig() { return this.tabStore.baseConfig(); }

  // no manual unsubscribe needed when using effects

  ngOnInit(): void {
    // Store handles effects and syncing with change services
  }

  tabInfos = [
    { id: 1, label: 'Car Engine' },
    { id: 2, label: 'Car Color' },
    { id: 3, label: 'Car Rim' },
    { id: 4, label: 'Special Equipments' }
  ];

  selectTab(index: number): void {
    this.tabStore.selectTab(index);
  }

  showCarEngine() {
    const config = this.baseConfig;
    return !!(config && config.carEngines && config.carEngines.length > 0);
  }

  showCarColor() {
    const config = this.baseConfig;
    return !!(config && config.carColors && config.carColors.length > 0);
  }

  showCarRims() {
    const config = this.baseConfig;
    return !!(config && config.carRims && config.carRims.length > 0);
  }

  showSpecialEquipment() {
    const config = this.baseConfig;
    return !!(config && config.specialEquipment && config.specialEquipment.length > 0);
  }

  get maxUnlockedTabId(): number {
    return this.tabStore.maxUnlockedTabId;
  }

  hasPreviousTab(): boolean {
    return this.tabStore.activeTab() > 1;
  }

  goToPreviousTab(): void {
    if (this.hasPreviousTab()) {
      this.tabStore.goToPreviousTab();
      queueMicrotask(() => this.scrollToTop());
    }
  }

  canProceedFromActiveTab(): boolean {
    return this.tabStore.canProceedFromActiveTab();
  }

  goToNextTab(): void {
    this.tabStore.goToNextTab();
    queueMicrotask(() => this.scrollToTop());
  }

  private scrollToTop(): void {
    const el = this.tabScroll?.nativeElement;
    if (!el) return;
    el.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
