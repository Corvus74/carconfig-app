import {Component} from '@angular/core';
import {CarConfigHeaderComponent} from '../../components/car-config-header/car-config-header.component';
import {CarConfigConfigMenuComponent} from '../../components/car-config-menu/car-config-config-menu.component';
import {CarConfig3dCarViewComponent} from '../../components/car-config-3d-car-view/car-config-3d-car-view.component';
import {CarConfigOrderComponent} from '../../components/car-config-order/car-config-order.component';
import {
  CarConfigCarInformationComponent
} from '../../components/car-config-car-information/car-config-car-information.component';

@Component({
  selector: 'app-car-config-main',
  imports: [
    CarConfigHeaderComponent,
    CarConfigConfigMenuComponent,
    CarConfig3dCarViewComponent,
    CarConfigOrderComponent,
    CarConfigCarInformationComponent
  ],
  templateUrl: './car-config-main.component.html',
  styleUrl: './car-config-main.component.scss'
})
export class CarConfigMainComponent {

}

