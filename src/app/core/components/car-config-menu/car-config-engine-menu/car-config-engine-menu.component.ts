import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {CarEngineDto} from '../../../api';
import {
  CarConfigEngineMenuItemComponent
} from './car-config-engine-menu-item/car-config-engine-menu-item.component';
import {CarConfigChangeService} from '../../../service/car-config-change.service';

@Component({
  selector: 'app-car-config-engine-menu',
  imports: [
    CarConfigEngineMenuItemComponent
  ],
  templateUrl: './car-config-engine-menu.component.html',
  styleUrl: './car-config-engine-menu.component.scss'
})
export class CarConfigEngineMenuComponent implements AfterViewInit{
  @Input() carEngines: CarEngineDto[] | undefined
  @Input() selectedValue: any;
  @ViewChild('container') container: ElementRef | undefined;

  constructor(private readonly carConfigChanged:CarConfigChangeService) {
  }
  ngAfterViewInit() {

  }

  onItemSelected(value: CarEngineDto): void {
    this.selectedValue = value;
    this.carConfigChanged.updateEngineData(value);
  }

  scroll(direction: 'left' | 'right') {
    if (this.container) {
      const container = this.container.nativeElement;
      const scrollAmount = 200; // Adjust this value to change how much it scrolls

      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  }

  nextClick() {

  }
}
