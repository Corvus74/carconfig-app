import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';


const getRandomId = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
@Component({
  selector: 'app-car-config-labeled-input',
  imports: [
    FormsModule
  ],
  templateUrl: './car-config-labeled-input.component.html',
  styleUrl: './car-config-labeled-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CarConfigLabeledInputComponent),
      multi: true,
    },
  ],
  standalone: true,
})
export class CarConfigLabeledInputComponent {
  inputId = `form-input-${getRandomId(5)}`;

  /**
   * The text that will be displayed as the label for the input.
   */
  @Input() label: string = 'Label';

  /**
   * The HTML type of the input element (e.g., 'text', 'email', 'password').
   */
  @Input() type: string = 'text';

  /**
   * The placeholder text to display inside the input field.
   */
  @Input() placeholder: string = '';

  /**
   * The value of the input field, using two-way data binding.
   * This property is connected to the parent component.
   */
  @Input() value: any;

  /**
   * Event emitter to notify the parent component when the input value changes.
   */
  @Output() valueChange = new EventEmitter<any>();

  /**
   * Handles the change event from the ngModel binding and emits it to the parent.
   * @param newValue The new value of the input field.
   */
  onValueChange(newValue: any): void {
    this.valueChange.emit(newValue);
  }
}


