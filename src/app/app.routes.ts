import { Routes } from '@angular/router';
import {CarConfigMainComponent} from './core/view/car-config-main/car-config-main.component';
import {CarConfigOrderViewComponent} from './core/view/car-config-order-view/car-config-order-view.component';
import {
  CarConfigProductViewComponent
} from './core/view/car-config-product-view/car-config-product-view.component';

export const routes: Routes = [
  { path: '', component: CarConfigMainComponent },
  { path: 'order/:id', component: CarConfigOrderViewComponent,pathMatch: 'full' },
  { path: 'product/:engineId/:colorId/:rimId/:specialEquipmentIdOne/:specialEquipmentIdTwo/:specialEquipmentIdThree/:specialEquipmentIdFour/:specialEquipmentIdFive', component: CarConfigProductViewComponent },
];
