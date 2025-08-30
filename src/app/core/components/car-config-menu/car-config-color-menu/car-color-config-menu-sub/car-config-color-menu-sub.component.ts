import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CarColorDto} from '../../../../api';
import {CarConfigChangeService} from '../../../../service/car-config-change.service';
import {Subscription} from 'rxjs';
import {
  CarConfigColorMenuColorItemComponent
} from './car-config-color-menu-color-item/car-config-color-menu-color-item.component';

@Component({
  selector: 'app-car-color-menu-sub',
  imports: [
    CarConfigColorMenuColorItemComponent
  ],
  templateUrl: './car-config-color-menu-sub.component.html',
  styleUrl: '../car-config-color-menu.component.scss'
})
export class CarConfigColorMenuSubComponent implements OnInit, OnDestroy {
  @Input() carColorSub: CarColorDto[] | undefined;
  @Input() titleName: string | undefined;
  @Input() selectedValue: CarColorDto | undefined;
  @Output() selectionChange = new EventEmitter<void>();
  @ViewChild('container') container: ElementRef | undefined;
  private carColorSubscription: Subscription | undefined;
  readonly CarColorDto = CarColorDto;

  constructor(private readonly carConfigChangeService: CarConfigChangeService) {

  }

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
    this.carConfigChangeService.updateCarColorData(value)
    this.selectionChange.emit();
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
}
