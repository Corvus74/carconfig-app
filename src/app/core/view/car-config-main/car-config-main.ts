import {Component, OnInit} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {BaseConfigDto, PoolControllerService} from '../../api';
import {appConfig} from '../../../app.config';
import {CarConfigHeader} from '../../components/car-config-header/car-config-header';
import {CarConfigSidebar} from '../../components/car-config-sidebar/car-config-sidebar';

@Component({
  selector: 'app-car-config-main',
  imports: [
    CarConfigHeader,
    CarConfigSidebar
  ],
  templateUrl: './car-config-main.html',
  styleUrl: './car-config-main.scss'
})
export class CarConfigMain implements OnInit {
  private appConfig: BaseConfigDto = {};
  private isLoading = false;

  constructor(private readonly poolControllerService: PoolControllerService) {
  }

  ngOnInit(): void {
     this.loadBaseConfig().then(text => {
         console.log("Sucessful loaded the base data");
       },
       err => {
        console.log("data could not loaded")
       })
  }

  async loadBaseConfig() {
    try {
      this.isLoading = true;
      this.appConfig = await firstValueFrom(
        this.poolControllerService.getBaseConfiguration()
      );
      return "Baseconfig loaded";

    } catch (error) {
      console.error("Error fetching Transports:", error);
      throw error;
    } finally {
      console.log(appConfig)
      this.isLoading = false;
    }
  }
}

