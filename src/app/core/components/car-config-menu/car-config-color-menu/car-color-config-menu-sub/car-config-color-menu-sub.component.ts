import { Component, ElementRef, input, output, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CarColorDto } from '../../../../api';
import { CarConfigChangeService } from '../../../../service/car-config-change.service';
import { Subscription } from 'rxjs';
import { CarConfigColorMenuColorItemComponent } from './car-config-color-menu-color-item/car-config-color-menu-color-item.component';

@Component({
  selector: 'app-car-color-menu-sub',
  imports: [
    CarConfigColorMenuColorItemComponent
  ],
  templateUrl: './car-config-color-menu-sub.component.html',
  styleUrl: '../car-config-color-menu.component.scss'
})
export class CarConfigColorMenuSubComponent implements OnInit, OnDestroy {
  readonly carColorSub = input<CarColorDto[] | undefined>(undefined);
  readonly titleName = input<string | undefined>(undefined);
  readonly selectionChange = output<CarColorDto>();
  @ViewChild('container') container: ElementRef | undefined;

  private readonly carConfigChangeService = inject(CarConfigChangeService);
  private carColorSubscription: Subscription | undefined;
  readonly CarColorDto = CarColorDto;

  selectedValue: CarColorDto | undefined;

  ngOnInit(): void {
    this.carColorSubscription = this.carConfigChangeService.colorData$.subscribe(
      (data) => {
        this.selectedValue = data;
      }
    );
  }

  ngOnDestroy(): void {
    this.carColorSubscription?.unsubscribe();
  }

  onItemSelected(value: CarColorDto): void {
    this.selectedValue = value;
    this.carConfigChangeService.updateCarColorData(value);
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
