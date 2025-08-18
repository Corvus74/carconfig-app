import { Component } from '@angular/core';
import {IMAGE_CONFIG, NgOptimizedImage} from '@angular/common';
import {CarConfigUserInput} from './cconf-user-input/car-config-user-input';

@Component({
  selector: 'app-car-config-header',
  imports: [
    NgOptimizedImage,
    CarConfigUserInput
  ],
  templateUrl: './cconf-header.html',
  styleUrl: './car-config-header.component.scss',
  providers:[  {    provide: IMAGE_CONFIG,    useValue: {      placeholderResolution: 40    }  }]
})
export class CarConfigHeaderComponent {
  isLoggedIn: boolean=false;
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
