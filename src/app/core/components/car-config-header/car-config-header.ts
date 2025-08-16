import { Component } from '@angular/core';
import {IMAGE_CONFIG, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-car-config-header',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './car-config-header.html',
  styleUrl: './car-config-header.scss',
  providers:[  {    provide: IMAGE_CONFIG,    useValue: {      placeholderResolution: 40    }  }]
})
export class CarConfigHeader {
  /**
   * Method to handle the button click event.
   */
  onButtonClick(): void {
    alert('Settings button was clicked!');
  }
}
