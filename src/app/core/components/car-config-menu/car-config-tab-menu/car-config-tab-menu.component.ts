import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CarConfigColorMenuComponent} from "../car-config-color-menu/car-config-color-menu.component";
import {CarConfigEngineMenuComponent} from "../car-config-engine-menu/car-config-engine-menu.component";
import {CarConfigRimMenuComponent} from "../car-config-rim-menu/car-config-rim-menu.component";
import {
    CarConfigEquipmentMenuComponent
} from "../car-config-equipment-menu/car-config-equipment-menu.component";
import {BaseConfigDto} from '../../../api';
import {CarTabMenuChangeService} from '../../../service/car-config-menu-tabs.service';
import {Subscription} from 'rxjs';
import {CarConfigMenuTabs} from '../../../models/CarConfigMenuTabs';
import {CarConfigChangeService} from '../../../service/car-config-change.service';

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
export class CarConfigTabMenuComponent implements OnInit, OnDestroy{
  @Input() baseConfig: BaseConfigDto = {};
  tabsStatus: CarConfigMenuTabs={tabEngine:false, tabColor:false, tabRim:false, tabSpecialEquipment:false, activeTab:1};
  @ViewChild('tabScroll') tabScroll?: ElementRef<HTMLElement>;
  private carTabMenuChangeSubscription: Subscription | undefined;
  private carEngineSubscription: Subscription | undefined;
  private carColorSubscription: Subscription | undefined;
  private carRimSubscription: Subscription | undefined;
  private carSpecialEquipmentSubscription: Subscription | undefined;
  activeTab = 1; // Initialize with the first tab as active
  constructor(private readonly carConfigChangeService:CarConfigChangeService, private readonly carTabMenuChangeService: CarTabMenuChangeService) {
  }
  //Big problem KI says tab status on local variables -but  the component will render each time again
  ngOnDestroy(): void {
        this.carColorSubscription?.unsubscribe();
        this.carEngineSubscription?.unsubscribe();
        this.carRimSubscription?.unsubscribe();
        this.carSpecialEquipmentSubscription?.unsubscribe();
        this.carTabMenuChangeSubscription?.unsubscribe();
    }


  ngOnInit(): void {
    // Subscribe to the observable to get the latest data
    this.carEngineSubscription = this.carConfigChangeService.engineData$.subscribe(
      (data) => {
        if(data.productId){
          this.onEngineSelected();
        }
      }
    );
    this.carColorSubscription = this.carConfigChangeService.colorData$.subscribe(
      (data) => {
        if(data.productId){
          this.onColorSelected();
        }
      }
    );

    this.carRimSubscription = this.carConfigChangeService.rimDataData$.subscribe(
      (data) => {
        if(data.productId){
          this.onRimsSelected();
        }
      }
    );
    this.carSpecialEquipmentSubscription = this.carConfigChangeService.specialEquipmentData$.subscribe(
      (data) => {
        if(data){
          const equipmentFirstElem = data[0]?.productId;
          if(equipmentFirstElem)
           this.onSpecialSelected();
        }
      }
    );

      this.carTabMenuChangeSubscription =this.carTabMenuChangeService.carConfigTabInfoData$.subscribe(
        (data) => {
          this.tabsStatus= data;
          const active = this.tabsStatus?.activeTab;
          if (active) {
            this.activeTab = active;
          }
        }
      );

  }

  tabInfos = [
    { id: 1,label: 'Car Engine'},
    { id: 2,label: 'Car Color'},
    { id: 3,label: 'Car Rim' },
    { id: 4,label: 'Special Equipments' }
  ];

  selectTab(index: number): void {
    this.activeTab = index;
  }

  showCarEngine() {
    return ((this.baseConfig.carEngines) && this.baseConfig.carEngines.length > 0);
  }

  showCarColor() {
    return ((this.baseConfig.carColors) && this.baseConfig.carColors.length > 0);
  }

  showCarRims() {
    return ((this.baseConfig.carRims) && this.baseConfig.carRims.length > 0);
  }

  showSpecialEquipment() {
    return ((this.baseConfig.specialEquipment) && this.baseConfig.specialEquipment.length > 0);
  }

  // Steuert, bis zu welcher Tab-ID Tabs sichtbar/anklickbar sind
  get maxUnlockedTabId(): number {
    // Beispielhafte Reihenfolge: 1=Engine, 2=Color, 3=Rims, 4=Special
    if (!this.tabsStatus.tabEngine) return 1;
    if (!this.tabsStatus.tabColor) return 2;
    if (!this.tabsStatus.tabRim) return 3;
    return 4;
  }


  // Navigation zwischen Tabs
  hasPreviousTab(): boolean {
    return this.activeTab > 1;
  }

  goToPreviousTab(): void {
    if (this.hasPreviousTab()) {
      this.selectTab(this.activeTab - 1);
      // Optional: beim Tabwechsel nach oben scrollen
      queueMicrotask(() => this.scrollToTop());
    }
  }

  canProceedFromActiveTab(): boolean {
    switch (this.activeTab) {
      case 1: return this.tabsStatus.tabEngine?? false;
      case 2: return this.tabsStatus.tabColor?? false;
      case 3: return this.tabsStatus.tabRim?? false;
      case 4: return this.tabsStatus.tabSpecialEquipment?? false;
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
    if(!this.tabsStatus.tabEngine){
      this.tabsStatus.tabEngine = true;
      this.carTabMenuChangeService.updateTabStatus(this.tabsStatus)
    }
  }

  private onColorSelected(): void {
    if(!this.tabsStatus.tabColor){
      this.tabsStatus.tabColor = true;
      this.carTabMenuChangeService.updateTabStatus(this.tabsStatus)
    }
  }

  private onRimsSelected(): void {
    if(!this.tabsStatus.tabRim){
      this.tabsStatus.tabRim = true;
      this.carTabMenuChangeService.updateTabStatus(this.tabsStatus)
    }

  }

  private onSpecialSelected(): void {
    if(!this.tabsStatus.tabSpecialEquipment){
      this.tabsStatus.tabSpecialEquipment = true;
      this.carTabMenuChangeService.updateTabStatus(this.tabsStatus)
    }
  }
}
