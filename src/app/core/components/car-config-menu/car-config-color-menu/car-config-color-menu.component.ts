import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CarColorDto} from '../../../api';
import {
  CarConfigColorMenuStyleItemComponent
} from './car-config-color-menu-style-item/car-config-color-menu-style-item.component';
import {CarConfigChangeService} from '../../../service/car-config-change.service';
import {
  CarConfigColorMenuColorItemComponent
} from './car-config-color-menu-color-item/car-config-color-menu-color-item.component';

@Component({
  selector: 'app-car-config-color-menu',
  imports: [
    CarConfigColorMenuStyleItemComponent,
    CarConfigColorMenuColorItemComponent
  ],
  templateUrl: './car-config-color-menu.component.html',
  styleUrl: './car-config-color-menu.component.scss'
})
export class CarConfigColorMenuComponent {
  @Input() carColor: CarColorDto[] | undefined
  @Input() selectedValue: CarColorDto | undefined;
  @Input() selectedMaterialType: CarColorDto.MaterialTypeEnum | undefined;
  @ViewChild('container') container: ElementRef | undefined;

  protected readonly CarColorDto = CarColorDto;
  matteOptionName: string | undefined = "Matte";
  matteOptionDescription: string | undefined;
  glossyOptionDescription: string | undefined = "Metalic";
  glossyOptionName: string | undefined;
  optionStyle: CarColorDto.MaterialTypeEnum = CarColorDto.MaterialTypeEnum.Glossy

  constructor(private readonly carConfigChangeService: CarConfigChangeService) {

  }

  ngAfterViewInit() {

  }

  onItemSelected(value: CarColorDto): void {
    this.selectedValue = value;
    this.carConfigChangeService.updateCarColorData(value)
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


  onColorStyleChange(colorStyle: CarColorDto.MaterialTypeEnum) {
    this.optionStyle = colorStyle;
  }
}
