import {Component, Input} from '@angular/core';
import {CarOrderDto} from '../../api';
import {DatePipe} from '@angular/common';
import {
  CarConfigOrderOverviewStatusComponent
} from './car-config-order-overview-status/car-config-order-overview-status.component';
import {
  CarConfigOrderOverviewStatusEquipmentComponent
} from './car-config-order-overview-status-equipment/car-config-order-overview-status.equipment.component';

@Component({
  selector: 'app-car-config-order-overview',
  imports: [
    DatePipe,
    CarConfigOrderOverviewStatusComponent,
    CarConfigOrderOverviewStatusEquipmentComponent
  ],
  templateUrl: './car-config-order-overview.component.html',
  styleUrl: './car-config-order-overview.component.scss'
})
export class CarConfigOrderOverviewComponent {

  @Input() orderInfo: CarOrderDto = {};
  engineTitle: string | undefined="Car Engine";
  rimTitle: string | undefined="Car Rim";
  colorTitle: string | undefined="Car Color";
  specialEquipmentTitle: string | undefined="Special Equipments";


}
