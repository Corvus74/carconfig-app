import { Routes } from '@angular/router';
import { CarConfigMainComponent } from './core/view/car-config-main/car-config-main.component';
import { CarConfigOrderViewComponent } from './core/view/car-config-order-view/car-config-order-view.component';
import { CarConfigProductViewComponent } from './core/view/car-config-product-view/car-config-product-view.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: CarConfigMainComponent, canActivate: [authGuard] },
  { path: 'order/:id', component: CarConfigOrderViewComponent, pathMatch: 'full', canActivate: [authGuard] },
  { path: 'product/:engineId/:colorId/:rimId/:specialEquipmentIdOne/:specialEquipmentIdTwo/:specialEquipmentIdThree/:specialEquipmentIdFour/:specialEquipmentIdFive', component: CarConfigProductViewComponent, canActivate: [authGuard] },
  // Redirect any other unknown routes to the main page (or login if not authenticated)
  { path: '**', redirectTo: '' }
];
