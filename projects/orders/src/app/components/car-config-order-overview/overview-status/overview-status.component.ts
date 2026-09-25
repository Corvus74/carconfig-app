import {Component, Input} from '@angular/core';
import {CarOrderStatusDto} from '@carconfig/api-client';
import {DatePipe} from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-car-config-order-overview-status',
  imports: [
    DatePipe,
    TranslocoModule
  ],
  templateUrl: './overview-status.component.html',
  styleUrl: './overview-status.component.scss'
})
export class OverviewStatusComponent {
  @Input() orderStatus: CarOrderStatusDto | undefined= {};
  @Input() title: string | undefined = "";
  @Input() productName: string | undefined = "";

}
