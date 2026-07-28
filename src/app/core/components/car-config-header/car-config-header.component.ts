import { Component, inject } from '@angular/core';
import {IMAGE_CONFIG, NgOptimizedImage} from '@angular/common';
import {CarConfigUserInputComponent} from './car-config-header-user-input/car-config-user-input.component';
import { SnackbarService } from '../../service/snackbar.service';

@Component({
  selector: 'app-car-config-header',
  imports: [
    NgOptimizedImage,
    CarConfigUserInputComponent
  ],
  templateUrl: './car-config-header.component.html',
  styleUrls: ['./car-config-header.component.scss'],
  providers:[  {    provide: IMAGE_CONFIG,    useValue: {      placeholderResolution: 40    }  }]
})
export class CarConfigHeaderComponent {
  isLoggedIn: boolean=false;
  showUserInput: boolean=false;

  private readonly snackbar = inject(SnackbarService);

  /**
   * Method to handle the button click event.
   */
  onButtonClick(): void {
    this.snackbar.show('Settings button was clicked!');
  }

  onLoginClick() {

  }

  onLogoffClick() {

  }
}
