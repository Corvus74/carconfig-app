import { Component, OnInit, inject, signal } from '@angular/core';
import { BaseConfigDto, ConfigWebControllerService } from '../../api';
import { firstValueFrom } from 'rxjs';
import { CarConfigTabMenuComponent } from './car-config-tab-menu/car-config-tab-menu.component';

@Component({
  selector: 'app-car-config-menu',
  imports: [
    CarConfigTabMenuComponent
  ],
  templateUrl: './car-config-config-menu.component.html',
  styleUrl: './car-config-config-menu.component.scss'
})
export class CarConfigConfigMenuComponent implements OnInit {
  private readonly configWebControllerService = inject(ConfigWebControllerService);

  readonly baseConfig = signal<BaseConfigDto | null>(null);
  readonly isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadBaseConfig().then(text => {
        console.log(text);
      },
      err => {
        console.log(err);
      });
  }

  async loadBaseConfig(): Promise<string> {
    try {
      this.isLoading.set(true);
      const config = await firstValueFrom(
        this.configWebControllerService.getBaseConfiguration()
      );
      this.baseConfig.set(config);
      return 'Baseconfig loaded';
    } catch (error) {
      console.error('Error fetching Base Configuration:', error);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }
}
