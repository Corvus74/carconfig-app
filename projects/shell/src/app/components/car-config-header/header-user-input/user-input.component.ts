import { Component } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {LabeledInputComponent} from '@carconfig/car-ui';

@Component({
  selector: 'app-car-config-header-user-input',
  imports: [
    ReactiveFormsModule,
    LabeledInputComponent
  ],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss'
})
export class UserInputComponent {
  userInput: any;
  userNameChange(username: string) {
    console.log(username)
  }

  userEmailChange(email: string) {
console.log(email)
  }
}
