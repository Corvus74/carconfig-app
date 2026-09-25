import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {HeaderComponent} from '../../../../../shell/src/app/components/car-config-header/header.component';
import {MenuComponent} from '../../components/menu/menu.component';
import {CarConfig3dCarViewComponent, CarInformationComponent} from '@carconfig/car-ui';
import {CheckoutViewComponent} from '@carconfig/checkout';
import { CarTabMenuChangeService } from '@carconfig/car-state';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-car-config-main',
  imports: [
    HeaderComponent,
    MenuComponent,
    CheckoutViewComponent,
    CarConfig3dCarViewComponent,
    CarInformationComponent,
    RouterLink,
    TranslocoModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  readonly checkoutState = inject(CarTabMenuChangeService);
}

