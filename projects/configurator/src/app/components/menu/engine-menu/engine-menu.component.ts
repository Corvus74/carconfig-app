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
import { CarEngineDto } from '@carconfig/api-client';
import {
  EngineMenuItemComponent
} from './engine-menu-item/engine-menu-item.component';
import { CarConfigStoreService } from '@carconfig/car-state';
import { CarConfigMenuTabs } from '@carconfig/car-state';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-engine-menu',
  imports: [
    EngineMenuItemComponent,
    TranslocoModule
  ],
  templateUrl: './engine-menu.component.html',
  styleUrl: './engine-menu.component.scss'
})
export class EngineMenuComponent implements AfterViewInit {
  readonly carEngines = input<CarEngineDto[] | undefined>(undefined);
  @ViewChild('container') container: ElementRef | undefined;
  @ViewChildren(EngineMenuItemComponent, { read: ElementRef }) itemEls!: QueryList<ElementRef>;
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
    const selected = this.selectedValue;
    if (!selected) return false;
    return selected.productId
      ? selected.productId === carEngine.productId
      : selected === carEngine;
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
