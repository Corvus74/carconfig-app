import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CarRimDto} from '../../../api';
import {
  CarConfigRimMenuItemComponent
} from './car-config-rim-menu-item/car-config-rim-menu-item.component';
import {CarConfigChangeService} from '../../../service/car-config-change.service';

@Component({
  selector: 'app-car-config-rim-menu',
  imports: [
    CarConfigRimMenuItemComponent
  ],
  templateUrl: './car-config-rim-menu.component.html',
  styleUrl: './car-config-rim-menu.component.scss'
})
export class CarConfigRimMenuComponent{
  @Input() carRims: CarRimDto[] | undefined
  @Input() selectedValue: CarRimDto |undefined;
  @ViewChild('container') container: ElementRef | undefined;
  @Output() selectionChange = new EventEmitter<void>();


  constructor(private readonly carConfigChangeService:CarConfigChangeService) {
  }

  onItemSelected(value: CarRimDto): void {
    this.selectedValue = value;
    this.carConfigChangeService.updateCarRimData(value)
    this.selectionChange.emit();
  }


}
