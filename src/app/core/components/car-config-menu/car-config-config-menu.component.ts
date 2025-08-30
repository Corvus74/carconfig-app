import {Component,  OnInit,} from '@angular/core';
import {BaseConfigDto, ConfigWebControllerService} from '../../api';
import {firstValueFrom} from 'rxjs';
import {CarConfigTabMenuComponent} from './car-config-tab-menu/car-config-tab-menu.component';

@Component({
  selector: 'app-car-config-menu',
  imports: [
    CarConfigTabMenuComponent
  ],
  templateUrl: './car-config-config-menu.component.html',
  styleUrl: './car-config-config-menu.component.scss'
})
export class CarConfigConfigMenuComponent implements OnInit {
  baseConfig: BaseConfigDto = {};
  private isLoading = false;

  constructor(private readonly configWebControllerService: ConfigWebControllerService) {
  }

  ngOnInit(): void {
    this.loadBaseConfig().then(text => {
        console.log(text);
      },
      err => {
        console.log(err)
      })
  }

  async loadBaseConfig() {
    try {
      this.isLoading = true;
      this.baseConfig = await firstValueFrom(
        this.configWebControllerService.getBaseConfiguration()
      );
      return "Baseconfig loaded";

    } catch (error) {
      console.error("Error fetching Transports:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }
}
