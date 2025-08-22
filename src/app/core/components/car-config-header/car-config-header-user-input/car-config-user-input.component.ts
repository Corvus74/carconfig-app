import { Component } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CarConfigLabeledInputComponent} from '../../car-config-forms/car-config-labeled-input/car-config-labeled-input.component';

@Component({
  selector: 'app-car-config-header-user-input',
  imports: [
    ReactiveFormsModule,
    CarConfigLabeledInputComponent
  ],
  templateUrl: './car-config-user-input.component.html',
  styleUrl: './car-config-user-input.component.scss'
})
export class CarConfigUserInputComponent {
  userInput: any;
  userNameChange(username: string) {
    console.log(username)
  }

  userEmailChange(email: string) {
console.log(email)
  }
}
