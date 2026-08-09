import { Component, ElementRef, input, output, ViewChild, inject, effect } from '@angular/core';
import { CarColorDto } from '../../../../api';
import { CarConfigStoreService } from '../../../../service/car-config-store.service';
import { CarConfigColorMenuColorItemComponent } from './car-config-color-menu-color-item/car-config-color-menu-color-item.component';

@Component({
  selector: 'app-car-color-menu-sub',
  imports: [
    CarConfigColorMenuColorItemComponent
  ],
  templateUrl: './car-config-color-menu-sub.component.html',
  styleUrl: '../car-config-color-menu.component.scss'
})
export class CarConfigColorMenuSubComponent {
  readonly carColorSub = input<CarColorDto[] | undefined>(undefined);
  readonly titleName = input<string | undefined>(undefined);
  readonly selectionChange = output<CarColorDto>();
  @ViewChild('container') container: ElementRef | undefined;

  private readonly carConfigStoreService = inject(CarConfigStoreService);
  readonly CarColorDto = CarColorDto;

  selectedValue: CarColorDto | undefined;

  constructor() {
    effect(() => {
      const selected = this.carConfigStoreService.color();
      this.selectedValue = selected || undefined;
    });
  }


  onItemSelected(value: CarColorDto): void {
    console.log('[COLOR-SUB] Updating color:', value);
    this.selectedValue = value;
    this.carConfigStoreService.updateColor(value);
    this.selectionChange.emit(value);
  }

  scroll(direction: 'left' | 'right') {
    if (this.container) {
      const container = this.container.nativeElement;
      const scrollAmount = 200;

      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  }
}
