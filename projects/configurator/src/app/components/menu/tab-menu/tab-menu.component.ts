import {Component, ElementRef, ViewChild, inject, computed, input} from '@angular/core';
import { ColorMenuComponent } from "../color-menu/color-menu.component";
import { EngineMenuComponent } from "../engine-menu/engine-menu.component";
import { RimMenuComponent } from "../rim-menu/rim-menu.component";
import { EquipmentMenuComponent } from "../equipment-menu/equipment-menu.component";
import { BaseConfigDto } from '@carconfig/api-client';
import { CarConfigTabStore } from '../../../services/car-config-tab.store';
import { CarTabMenuChangeService } from '@carconfig/car-state';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-tab-menu',
  imports: [
    ColorMenuComponent,
    EngineMenuComponent,
    RimMenuComponent,
    EquipmentMenuComponent,
    TranslocoModule
  ],
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent {
  readonly tabStore = inject(CarConfigTabStore);
  private readonly checkoutState = inject(CarTabMenuChangeService);

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
    { id: 1, label: 'config.engine' },
    { id: 2, label: 'config.color' },
    { id: 3, label: 'config.rims' },
    { id: 4, label: 'config.equipment' }
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

  isTabComplete(tabId: number): boolean {
    const status = this.tabStore.tabsStatus();
    switch (tabId) {
      case 1: return !!status.tabEngine;
      case 2: return !!status.tabColor;
      case 3: return !!status.tabRim;
      case 4: return !!status.tabSpecialEquipment;
      default: return false;
    }
  }

  goToNextTab(): void {
    this.tabStore.goToNextTab();
    queueMicrotask(() => this.scrollToTop());
  }

  canShowOrderReview(): boolean {
    return !!this.tabStore.tabsStatus().tabRim;
  }

  showOrderReview(): void {
    if (this.canShowOrderReview()) this.checkoutState.showOrderReview();
  }

  private scrollToTop(): void {
    const el = this.tabScroll?.nativeElement;
    if (!el) return;
    el.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
