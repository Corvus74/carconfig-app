import { Component, inject } from '@angular/core';
import {IMAGE_CONFIG, NgOptimizedImage} from '@angular/common';
import {UserInputComponent} from './header-user-input/user-input.component';
import { SnackbarService } from '@carconfig/shared';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-car-config-header',
  imports: [
    NgOptimizedImage,
    UserInputComponent,
    TranslocoModule,
    LanguageSwitcherComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers:[  {    provide: IMAGE_CONFIG,    useValue: {      placeholderResolution: 40    }  }]
})
export class HeaderComponent {
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
