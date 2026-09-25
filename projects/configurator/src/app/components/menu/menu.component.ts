import {Component, inject, OnInit} from '@angular/core';
import { TabMenuComponent } from './tab-menu/tab-menu.component';
import {CarConfigFacadeService} from '../../services/CarConfigFacadeService';


@Component({
  selector: 'app-menu',
  imports: [
    TabMenuComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  private readonly facadeService = inject(CarConfigFacadeService);

  // Bind directly to the facade's read-only signal.
  readonly baseConfig = this.facadeService.baseConfig;

  ngOnInit(): void {
    // Trigger loading. Returning to this tab uses the facade cache when available.
    this.facadeService.loadBaseConfig();
  }

}
