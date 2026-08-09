import {
  Component,
  ElementRef,
  input,
  output,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  QueryList,
  inject,
  effect,
} from '@angular/core';
import { CarEngineDto } from '../../../api';
import {
  CarConfigEngineMenuItemComponent
} from './car-config-engine-menu-item/car-config-engine-menu-item.component';
import { CarConfigStoreService } from '../../../service/car-config-store.service';
import { CarConfigMenuTabs } from '../../../models/car-config-menu-tabs';

@Component({
  selector: 'app-car-config-engine-menu',
  imports: [
    CarConfigEngineMenuItemComponent
  ],
  templateUrl: './car-config-engine-menu.component.html',
  styleUrl: './car-config-engine-menu.component.scss'
})
export class CarConfigEngineMenuComponent implements AfterViewInit {
  readonly carEngines = input<CarEngineDto[] | undefined>(undefined);
  @ViewChild('container') container: ElementRef | undefined;
  @ViewChildren(CarConfigEngineMenuItemComponent, { read: ElementRef }) itemEls!: QueryList<ElementRef>;
  readonly selectionChange = output<void>();

  private readonly carConfigStoreService = inject(CarConfigStoreService);

  selectedValue: CarEngineDto | null | undefined;
  currenTabStatus: CarConfigMenuTabs | undefined;

  constructor() {
    effect(() => {
      const selected = this.carConfigStoreService.engine();
      this.selectedValue = selected;
      queueMicrotask(() => this.focusSelectedOrFirst());
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.focusSelectedOrFirst());
  }

  onItemSelected(value: CarEngineDto): void {
    this.selectedValue = value;
    this.carConfigStoreService.updateEngine(value);
    this.selectionChange.emit();
    queueMicrotask(() => this.focusSelectedOrFirst());
  }

  isValueSelected(carEngine: CarEngineDto): boolean {
    if (this.selectedValue !== null) {
      return carEngine === this.selectedValue;
    }
    return false;
  }

  private focusSelectedOrFirst(): void {
    const engines = this.carEngines();
    const items = this.itemEls;

    if (!engines?.length || !items?.length) return;

    const selectedIndex =
      this.selectedValue
        ? Math.max(0, engines.findIndex(e => e === this.selectedValue))
        : 0;

    const targetEl = items.get(selectedIndex)?.nativeElement as HTMLElement | undefined;
    if (!targetEl) return;

    try {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    } catch {

    }

    const focusable = targetEl.querySelector<HTMLElement>(
      'button, [tabindex], a, input, select, textarea'
    );

    (focusable ?? targetEl).focus?.();
  }

  scroll(direction: 'left' | 'right') {
    if (this.container) {
      const container = this.container.nativeElement as HTMLElement;
      const scrollAmount = 200;

      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  }
}
