import {Component, Input} from '@angular/core';
import {CarOrderStatusDto} from '../../../api';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-car-config-order-overview-status',
  imports: [
    DatePipe
  ],
  templateUrl: './car-config-order-overview-status.component.html',
  styleUrl: './car-config-order-overview-status.component.scss'
})
export class CarConfigOrderOverviewStatusComponent {
  @Input() orderStatus: CarOrderStatusDto | undefined= {};
  @Input() title: string | undefined = "";
  @Input() productName: string | undefined = "";

}
