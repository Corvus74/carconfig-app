import { Component } from '@angular/core';
import {IMAGE_CONFIG, NgOptimizedImage} from '@angular/common';
import {CarConfigUserInputComponent} from './car-config-header-user-input/car-config-user-input.component';

@Component({
  selector: 'app-car-config-header',
  imports: [
    NgOptimizedImage,
    CarConfigUserInputComponent
  ],
  templateUrl: './car-config-header.component.html',
  styleUrl: './car-config-header.component.scss',
  providers:[  {    provide: IMAGE_CONFIG,    useValue: {      placeholderResolution: 40    }  }]
})
export class CarConfigHeaderComponent {
  isLoggedIn: boolean=false;
  showUserInput: boolean=false;
  /**
   * Method to handle the button click event.
   */
  onButtonClick(): void {
    alert('Settings button was clicked!');
  }

  onLoginClick() {

  }

  onLogoffClick() {

  }
}
