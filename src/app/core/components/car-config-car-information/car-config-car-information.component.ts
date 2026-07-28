import {Component, OnInit, computed, inject} from '@angular/core';
import {CarConfigStoreService} from '../../service/car-config-store.service';
import {CarTabMenuChangeService} from '../../service/car-config-menu-tabs.service';
import {CarConfigMenuTabs} from '../../models/CarConfigMenuTabs';

@Component({
  selector: 'app-car-config-car-information',
  imports: [],
  templateUrl: './car-config-car-information.component.html',
  styleUrl: './car-config-car-information.component.scss'
})
export class CarConfigCarInformationComponent implements OnInit {
  private readonly carConfigStoreService = inject(CarConfigStoreService);
  private readonly carTabMenuChangeService = inject(CarTabMenuChangeService);

  // Direct signals - reactive to store updates
  readonly engineData = this.carConfigStoreService.engine;
  readonly colorData = this.carConfigStoreService.color;
  readonly rimData = this.carConfigStoreService.rims;
  readonly specialEquipment = this.carConfigStoreService.specialEquipment;

  // Computed signals for visibility
  readonly engineDataVisible = computed(() => this.engineData() !== null);
  readonly colorDataVisible = computed(() => this.colorData() !== null);
  readonly rimDataVisible = computed(() => this.rimData() !== null);

  carMenuTabs: CarConfigMenuTabs | undefined;

  ngOnInit(): void {
    console.log('[CAR-INFO] Component initialized');
    // Subscribe to menu tabs
    this.carTabMenuChangeService.carConfigTabInfoData$?.subscribe((data) => {
      this.carMenuTabs = data;
    });
  }

  showSpecialEquipment() {
    const equipment = this.specialEquipment();
    if (equipment && equipment.length > 0) {
      return equipment[0].productId
    }
    return false;
  }

  generateChosenText() {
    const equipment = this.specialEquipment();
    return "( " + equipment?.length + " of 5 Equipments selected)";
  }

  showCarInfo() {
    return !this.carMenuTabs?.showOrder;
  }

  showFinishedOrder() {
    return this.carMenuTabs?.tabSpecialEquipment;
  }

  onEarlyFinishedOrder() {
    if (this.carMenuTabs) {
      this.carMenuTabs.showOrder = true;
      this.carTabMenuChangeService.updateTabStatus(this.carMenuTabs)
    }
  }
}
