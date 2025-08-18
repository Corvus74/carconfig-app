import {Component, OnInit} from '@angular/core';
import {BaseConfigDto, PoolControllerService} from '../../api';
import {firstValueFrom} from 'rxjs';
import {CarConfigEngineMenuComponent} from './car-config-engine-menu/car-config-engine-menu.component';
import {CarConfigRimMenuComponent} from './car-config-rim-menu/car-config-rim-menu.component';
import {CarConfigColorMenuComponent} from './car-config-color-menu/car-config-color-menu..component';
import {
  CarConfigSpecialEquipmentMenuComponent
} from './car-config-special-equipment-menu/car-config-special-equipment-menu.component';

@Component({
  selector: 'app-car-config-menu',
  imports: [
    CarConfigEngineMenuComponent,
    CarConfigRimMenuComponent,
    CarConfigColorMenuComponent,
    CarConfigSpecialEquipmentMenuComponent
  ],
  templateUrl: './car-config-config-menu.component.html',
  styleUrl: './car-config-config-menu.component.scss'
})
export class CarConfigConfigMenuComponent implements OnInit {
  protected baseConfig: BaseConfigDto = {};
  private isLoading = false;


  constructor(private readonly poolControllerService: PoolControllerService) {
  }

  ngOnInit(): void {
    this.loadBaseConfig().then(text => {
        console.log("Successful loaded the base data");
      },
      err => {
        console.log("data could not loaded")
      })
  }

  async loadBaseConfig() {
    try {
      this.isLoading = true;
      this.baseConfig = await firstValueFrom(
        this.poolControllerService.getBaseConfiguration()
      );
      return "Baseconfig loaded";

    } catch (error) {
      console.error("Error fetching Transports:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
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
}
