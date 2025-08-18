import {Component, Input} from '@angular/core';
import {CarRimDto} from '../../../api';

@Component({
  selector: 'app-car-config-rim-menu',
  imports: [],
  templateUrl: './car-config-rim-menu.component.html',
  styleUrl: './car-config-rim-menu.component.scss'
})
export class CarConfigRimMenuComponent {
  @Input() carRims: CarRimDto[] | undefined


}
