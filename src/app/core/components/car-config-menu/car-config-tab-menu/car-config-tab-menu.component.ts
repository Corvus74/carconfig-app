import {Component, ElementRef, Input, ViewChild, inject, computed, input, signal} from '@angular/core';
import { CarConfigColorMenuComponent } from "../car-config-color-menu/car-config-color-menu.component";
import { CarConfigEngineMenuComponent } from "../car-config-engine-menu/car-config-engine-menu.component";
import { CarConfigRimMenuComponent } from "../car-config-rim-menu/car-config-rim-menu.component";
import { CarConfigEquipmentMenuComponent } from "../car-config-equipment-menu/car-config-equipment-menu.component";
import { BaseConfigDto } from '../../../api';
import { CarConfigTabStore } from '../../../service/car-config-tab.store';

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
export class CarConfigTabMenuComponent {
  readonly tabStore = inject(CarConfigTabStore);

  readonly baseConfig = input<BaseConfigDto | null>(null);

  @ViewChild('tabScroll') tabScroll?: ElementRef<HTMLElement>;

  // active tab getter
  readonly activeTab = this.tabStore.activeTab;
  readonly tabsStatus = this.tabStore.tabsStatus;

  readonly canShowCarEngine = computed(() => !!this.baseConfig()?.carEngines?.length);
  readonly canShowCarColor = computed(() => !!this.baseConfig()?.carColors?.length);
  readonly canShowCarRims = computed(() => !!this.baseConfig()?.carRims?.length);
  readonly canShowSpecialEquipment = computed(() => !!this.baseConfig()?.specialEquipment?.length);

  tabInfos = [
    { id: 1, label: 'Car Engine' },
    { id: 2, label: 'Car Color' },
    { id: 3, label: 'Car Rim' },
    { id: 4, label: 'Special Equipments' }
  ];
  selectTab(index: number): void {
    this.tabStore.selectTab(index);
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
