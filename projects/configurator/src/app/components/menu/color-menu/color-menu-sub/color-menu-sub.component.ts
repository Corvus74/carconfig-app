import { Component, ElementRef, input, output, viewChild, inject, effect } from '@angular/core';
import { CarColorDto } from '@carconfig/api-client';
import { CarConfigStoreService } from '@carconfig/car-state';
import { ColorMenuColorItemComponent } from './color-menu-color-item/color-menu-color-item.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-color-menu-sub',
  imports: [
    ColorMenuColorItemComponent,
    TranslocoModule
  ],
  templateUrl: './color-menu-sub.component.html',
  styleUrl: '../color-menu.component.scss'
})
export class ColorMenuSubComponent {
  readonly carColorSub = input<CarColorDto[] | undefined>(undefined);
  readonly titleName = input<string | undefined>(undefined);
  readonly selectionChange = output<CarColorDto>();
  readonly container = viewChild<ElementRef<HTMLDivElement>>('container');

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
    this.selectedValue = value;
    this.carConfigStoreService.updateColor(value);
    this.selectionChange.emit(value);
  }

  isValueSelected(color: CarColorDto): boolean {
    const selected = this.selectedValue;
    return !!selected && (selected.productId
      ? selected.productId === color.productId
      : selected === color);
  }

  scroll(direction: 'left' | 'right') {
    const element = this.container()?.nativeElement;
    if (element) {
      const scrollAmount = 200;

      if (direction === 'left') {
        element.scrollLeft -= scrollAmount;
      } else {
        element.scrollLeft += scrollAmount;
      }
    }
  }
}
