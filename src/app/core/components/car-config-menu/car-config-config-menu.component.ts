import {Component, inject, OnInit} from '@angular/core';
import { CarConfigTabMenuComponent } from './car-config-tab-menu/car-config-tab-menu.component';
import {CarConfigFacadeService} from '../../service/CarConfigFacadeService';


@Component({
  selector: 'app-car-config-menu',
  imports: [
    CarConfigTabMenuComponent
  ],
  templateUrl: './car-config-config-menu.component.html',
  styleUrl: './car-config-config-menu.component.scss'
})
export class CarConfigConfigMenuComponent implements OnInit {
  private readonly facadeService = inject(CarConfigFacadeService);

  // Direkte Verknüpfung mit dem Read-Only-Signal der Facade
  readonly baseConfig = this.facadeService.baseConfig;

  ngOnInit(): void {
    // Löst das Laden sicher aus. Wechselt der User den Tab und kommt zurück,
    // blockiert die Facade den HTTP-Call und liefert sofort den Cache.
    this.facadeService.loadBaseConfig();
  }

}
