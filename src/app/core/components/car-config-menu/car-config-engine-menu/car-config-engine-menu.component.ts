import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewChildren, AfterViewInit, QueryList} from '@angular/core';
import {CarEngineDto} from '../../../api';
import {
  CarConfigEngineMenuItemComponent
} from './car-config-engine-menu-item/car-config-engine-menu-item.component';
import {CarConfigChangeService} from '../../../service/car-config-change.service';
import {Subscription} from 'rxjs';
import {CarConfigMenuTabs} from '../../../models/CarConfigMenuTabs';

@Component({
  selector: 'app-car-config-engine-menu',
  imports: [
    CarConfigEngineMenuItemComponent
  ],
  templateUrl: './car-config-engine-menu.component.html',
  styleUrl: './car-config-engine-menu.component.scss'
})
export class CarConfigEngineMenuComponent implements OnInit, AfterViewInit, OnDestroy{
  @Input() carEngines: CarEngineDto[] | undefined
  @ViewChild('container') container: ElementRef | undefined;
  @ViewChildren(CarConfigEngineMenuItemComponent, { read: ElementRef }) itemEls!: QueryList<ElementRef>;
  @Output() selectionChange = new EventEmitter<void>();
  private carEngineSubscription: Subscription | undefined;
  selectedValue: CarEngineDto| undefined;
  currenTabStatus: CarConfigMenuTabs | undefined;

  constructor(private readonly carConfigChangeService:CarConfigChangeService) {
  }

  ngOnInit() {
    this.carEngineSubscription = this.carConfigChangeService.engineData$.subscribe(
      (data) => {
        this.selectedValue= data;
        // Fokus aktualisieren, nachdem Template gerendert ist
        queueMicrotask(() => this.focusSelectedOrFirst());
      }
    );
  }

  ngAfterViewInit(): void {
    // Initialer Fokus nach dem ersten Render
    queueMicrotask(() => this.focusSelectedOrFirst());
  }

  ngOnDestroy(): void {
    this.carEngineSubscription?.unsubscribe();
  }

  onItemSelected(value: CarEngineDto): void {
    this.selectedValue = value;
    this.carConfigChangeService.updateEngineData(value);
    this.selectionChange.emit();
    // Nach Auswahl Fokus und Sichtbarkeit sicherstellen
    queueMicrotask(() => this.focusSelectedOrFirst());
  }

  private focusSelectedOrFirst(): void {
    if (!this.carEngines || this.carEngines.length === 0 || !this.itemEls || this.itemEls.length === 0) return;

    const selectedIndex = this.selectedValue
      ? Math.max(0, this.carEngines.findIndex(e => e === this.selectedValue))
      : 0;

    const targetEl: HTMLElement | undefined = this.itemEls.get(selectedIndex)?.nativeElement;
    if (!targetEl) return;

    // In Sicht scrollen
    try {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } catch {
      // Fallback ignorieren
    }

    // Fokus setzen: zuerst auf ein fokussierbares Kind (z. B. Button), sonst auf das Host-Element
    const focusable: HTMLElement | null =
      targetEl.querySelector('button, [tabindex], a, input, select, textarea') as HTMLElement | null;
    (focusable ?? targetEl).focus?.();
  }

  scroll(direction: 'left' | 'right') {
    if (this.container) {
      const container = this.container.nativeElement as HTMLElement;
      const scrollAmount = 200; // Anpassbar

      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  }
}
