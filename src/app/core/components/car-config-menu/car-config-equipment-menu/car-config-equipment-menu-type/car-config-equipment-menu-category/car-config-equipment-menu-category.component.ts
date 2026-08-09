import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  signal,
  ViewChild,
  inject,
  effect
} from '@angular/core';
import { CarConfigStoreService } from '../../../../../service/car-config-store.service';
import { SpecialEquipmentDto } from '../../../../../api';
import {
  CarConfigEquipmentMenuItemComponent
} from './car-config-equipment-menu-item/car-config-equipment-menu-item.component';

@Component({
  selector: 'app-car-config-equipment-menu-category',
  imports: [
    CarConfigEquipmentMenuItemComponent
  ],
  templateUrl: './car-config-equipment-menu-category.component.html',
  styleUrl: './car-config-equipment-menu-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarConfigEquipmentMenuCategoryComponent {
  readonly titleName = input<string>('');
  readonly specialEquipmentListInit = input<SpecialEquipmentDto[]>([]);
  @ViewChild('container') container: ElementRef | undefined;

  private readonly carConfigStoreService = inject(CarConfigStoreService);

  selectedEquipments = signal<SpecialEquipmentDto[]>([]);
  maxSelection = 5;
  selectedIds = signal<Set<string>>(new Set());
  selectedCategories = signal<Set<SpecialEquipmentDto.CategoryTypeEnum>>(new Set());
  categoryMenuShown = false;

  showCategoryMenu() {
    this.categoryMenuShown = !this.categoryMenuShown;
  }


  constructor() {
    effect(() => {
      const data = this.carConfigStoreService.specialEquipment();
      const sanitized = (data ?? []).filter(
        (e): e is SpecialEquipmentDto => !!e && !!e.productId
      );

      this.selectedEquipments.set(sanitized);
      this.selectedIds.set(new Set(sanitized.map(e => e.productId!)));
    });
  }


  onSelectItem(item: SpecialEquipmentDto): void {
    const id = item?.productId;
    if (!id) return;

    const current = this.selectedEquipments();
    const exists = current.some(e => e.productId === id);

    if (exists) {
      this.selectedEquipments.set(current.filter(e => e.productId !== id));
    } else {
      if (current.length >= this.maxSelection) {
        console.log(`Maximum of ${this.maxSelection} items can be selected.`);
        return;
      }

      if (this.simpleCheckForCategory(item, current)) {
        console.log(`Item with category ${item.categoryType} is already selected.`);
        return;
      }

      this.selectedEquipments.set([...current, item]);
    }

    this.carConfigStoreService.updateSpecialEquipment(this.selectedEquipments());
  }

  isSelectedAndNotDoubleByCategory(item: SpecialEquipmentDto): boolean {
    const id = item?.productId;
    return !!id && this.selectedIds().has(id);
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

  private simpleCheckForCategory(item: SpecialEquipmentDto, selected: SpecialEquipmentDto[]): boolean {
    if (item.categoryType === SpecialEquipmentDto.CategoryTypeEnum.Misc) {
      return false;
    }

    const categories = new Set(
      selected.map(e => e.categoryType).filter(Boolean)
    );

    return item.categoryType ? categories.has(item.categoryType) : false;
  }
}
