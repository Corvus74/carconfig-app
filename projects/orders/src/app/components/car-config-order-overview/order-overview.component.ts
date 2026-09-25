import {Component, Input} from '@angular/core';
import {CarOrderDto} from  '@carconfig/api-client';
import {DatePipe} from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import {
  OverviewStatusComponent
} from './overview-status/overview-status.component';
import {
  OverviewStatusEquipmentComponent
} from './overview-status-equipment/overview-status.equipment.component';

@Component({
  selector: 'app-car-config-order-overview',
  imports: [
    DatePipe,
    TranslocoModule,
    OverviewStatusComponent,
    OverviewStatusEquipmentComponent
  ],
  templateUrl: './order-overview.component.html',
  styleUrl: './order-overview.component.scss'
})
export class OrderOverviewComponent {

  @Input() orderInfo: CarOrderDto = {};
  engineTitle: string | undefined="orders.engine";
  rimTitle: string | undefined="orders.rims";
  colorTitle: string | undefined="orders.color";
  specialEquipmentTitle: string | undefined="orders.equipment";


}
