import {Component, Input} from '@angular/core';
import {SpecialEquipmentOrderDto} from '@carconfig/api-client';
import {DatePipe} from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-car-config-order-overview-status-equipment',
  imports: [
    DatePipe,
    TranslocoModule
  ],
  templateUrl: './overview-status.equipment.component.html',
  styleUrl: './overview-status.equipment.component.scss'
})
export class OverviewStatusEquipmentComponent {
  @Input() specialEquipmentOrders?: SpecialEquipmentOrderDto[] | undefined;
  @Input() title: string | undefined = "";

}
