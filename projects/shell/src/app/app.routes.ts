import { Routes } from '@angular/router';
import { MainComponent } from '../../../configurator/src/app/views/main/main.component';
import { ViewComponent } from '../../../orders/src/app/views/order/view.component';
import { ProductViewComponent } from '../../../configurator/src/app/views/product/product-view.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from '@carconfig/auth';
import { UserManagementComponent } from '@carconfig/user-management';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user-management', component: UserManagementComponent, canMatch: [authGuard], canActivate: [authGuard] },
  { path: '', component: MainComponent, canMatch: [authGuard], canActivate: [authGuard] },
  { path: 'order/:id', component: ViewComponent, pathMatch: 'full', canMatch: [authGuard],canActivate: [authGuard] },
  { path: 'product/:engineId/:colorId/:rimId/:specialEquipmentIdOne/:specialEquipmentIdTwo/:specialEquipmentIdThree/:specialEquipmentIdFour/:specialEquipmentIdFive', component: ProductViewComponent,  canMatch: [authGuard], canActivate: [authGuard] },
  // Redirect any other unknown routes to the main page (or login if not authenticated)
  { path: '**', redirectTo: '' }
];
