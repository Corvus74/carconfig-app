import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';


@Component({
  selector: 'app-car-config-labeled-input',
  imports: [
    FormsModule
  ],
  templateUrl: './labeled-input.component.html',
  styleUrl: './labeled-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LabeledInputComponent),
      multi: true,
    },
  ],
  standalone: true,
})
export class LabeledInputComponent {
  inputId = `form-input-${crypto.randomUUID()}`;

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


