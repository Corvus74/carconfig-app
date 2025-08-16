import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgClass} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/input';

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
  selector: 'app-labeled-input',
  imports: [
    NgClass,
    MatFormField,
    MatLabel
  ],
  templateUrl: './labeled-input.html',
  styleUrl: './labeled-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LabeledInput),
      multi: true,
    },
  ],
  standalone: true,
})
export class LabeledInput implements OnInit{
  @Input() label?: string;
  @Input() type?: string = 'text';
  @Input() placeholder?: string;
  @Input() readonly: boolean = false;
  @Input() isFloating: boolean = true;
  @Input() isPlaintext: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';

  value?: any;

  inputId = `form-input-${getRandomId(5)}`;

  private onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit(): void {
    // Only set defaults if both label and placeholder are undefined or null
    // Empty string is a valid value that should be respected
    if ((this.label === undefined || this.label === null) && this.placeholder) {
      this.label = this.placeholder;
    }
    // Only set placeholder to label if placeholder is undefined (not explicitly set to empty string)
    if (this.label && this.placeholder === undefined) {
      this.placeholder = this.label;
    }

    // If both are undefined/null, use default translation keys
    if ((this.label === undefined || this.label === null) && this.placeholder === undefined) {
      this.label = 'FORM.INPUT.DEFAULT_LABEL';
      this.placeholder = 'FORM.INPUT.DEFAULT_PLACEHOLDER';
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // This method is required by the ControlValueAccessor interface
    // but not implemented in this component as we don't have a disabled state
  }

  onValueChange(newValue: any): void {
    this.onChange(newValue.target.value);
  }

  markAsTouched(): void {
    this.onTouched();
  }

}
