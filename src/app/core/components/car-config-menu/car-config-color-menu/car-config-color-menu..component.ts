import {Component, Input} from '@angular/core';
import {CarColorDto} from '../../../api';

@Component({
  selector: 'app-car-config-color',
  imports: [],
  templateUrl: './car-config-color-menu..component.html',
  styleUrl: './car-config-color-menu..component.scss'
})
export class CarConfigColorMenuComponent {
  @Input() carColor: CarColorDto[] | undefined
}
