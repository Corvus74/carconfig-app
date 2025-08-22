import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CarColorDto} from '../../../../api';

@Component({
  selector: 'app-car-config-color-menu-style-item',
  imports: [],
  templateUrl: './car-config-color-menu-style-item.component.html',
  styleUrl: './car-config-color-menu-style-item.component.scss'
})
export class CarConfigColorMenuStyleItemComponent {
  @Input() description: string |undefined;
  @Input() title: string |undefined;
  @Input() value: CarColorDto.MaterialTypeEnum | undefined;
  @Input() isSelected: boolean = false;
  @Output() itemSelected = new EventEmitter<CarColorDto.MaterialTypeEnum>();

  onClick(): void {
    this.itemSelected.emit(this.value);
  }
}
