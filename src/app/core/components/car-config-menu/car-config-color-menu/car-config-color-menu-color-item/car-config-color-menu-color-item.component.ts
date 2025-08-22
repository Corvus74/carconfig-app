import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CarColorDto} from '../../../../api';
import {CarConfigColorviewCircle} from '../../../../common/car-config-colorview-circle/car-config-colorview-circle';

@Component({
  selector: 'app-car-config-color-menu-color-item',
  imports: [
    CarConfigColorviewCircle
  ],
  templateUrl: './car-config-color-menu-color-item.component.html',
  styleUrl: './car-config-color-menu-color-item.component.scss'
})
export class CarConfigColorMenuColorItemComponent implements OnInit {

  @Input() value: CarColorDto | undefined;
  @Input() isSelected: boolean = false;
  @Output() itemSelected = new EventEmitter<CarColorDto>();

  colorCodeHex: string = "00000"

  ngOnInit(): void {
    if (this.value) {
      if (this.value.colorCodeHex) {
        this.colorCodeHex = this.value.colorCodeHex;
      }
    }
  }

  onClick(): void {
    this.itemSelected.emit(this.value);
  }
}
