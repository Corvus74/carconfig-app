import {Component, OnInit, ViewChild} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {BaseConfigDto, PoolControllerService} from '../../api';
import {appConfig} from '../../../app.config';
import {CarConfigHeaderComponent} from '../../components/car-config-header/car-config-header.component';
import {CarConfigSidebar} from '../../components/car-config-sidebar/car-config-sidebar';
import {CarConfigCarCanvas} from '../../components/cconf-car-model/car-config-car-canvas';
import {CarConfigOrderComponent} from '../../components/car-config-order/car-config-order.component';

@Component({
  selector: 'app-car-config-main',
  imports: [
    CarConfigHeaderComponent,
    CarConfigSidebar,
    CarConfigCarCanvas,
    CarConfigOrderComponent
  ],
  templateUrl: './car-config-main.component.html',
  styleUrl: './car-config-main.component.scss'
})
export class CarConfigMainComponent {
  protected baseConfig: BaseConfigDto = {};
  private isLoading = false;

  constructor(private readonly poolControllerService: PoolControllerService) {
  }

}

