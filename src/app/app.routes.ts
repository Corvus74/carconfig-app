import { Routes } from '@angular/router';
import {CarConfigMainComponent} from './core/view/car-config-main/car-config-main.component';
import {CarConfigOrderViewComponent} from './core/view/car-config-order-view/car-config-order-view.component';

export const routes: Routes = [
  { path: '', component: CarConfigMainComponent },
  { path: 'order/:id', component: CarConfigOrderViewComponent,pathMatch: 'full' },
];
