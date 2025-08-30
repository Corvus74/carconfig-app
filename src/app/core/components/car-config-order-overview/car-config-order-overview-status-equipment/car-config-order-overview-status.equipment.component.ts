import {Component, Input, OnInit} from '@angular/core';
import {CarOrderStatusDto, SpecialEquipmentOrderDto} from '../../../api';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-car-config-order-overview-status-equipment',
  imports: [
    DatePipe
  ],
  templateUrl: './car-config-order-overview-status.equipment.component.html',
  styleUrl: './car-config-order-overview-status.equipment.component.scss'
})
export class CarConfigOrderOverviewStatusEquipmentComponent{
  @Input() specialEquipmentOrders?: SpecialEquipmentOrderDto[] | undefined;
  @Input() title: string | undefined = "";

}
