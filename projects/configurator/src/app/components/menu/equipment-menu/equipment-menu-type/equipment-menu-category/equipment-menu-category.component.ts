import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CarConfigStoreService } from '@carconfig/car-state';
import { SpecialEquipmentDto } from '@carconfig/api-client';
import { EquipmentMenuItemComponent } from './equipment-menu-item/equipment-menu-item.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-equipment-menu-category',
  imports: [EquipmentMenuItemComponent, TranslocoModule],
  templateUrl: './equipment-menu-category.component.html',
  styleUrl: './equipment-menu-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentMenuCategoryComponent {
  readonly titleName = input<string>('');
  readonly specialEquipmentListInit = input<SpecialEquipmentDto[]>([]);

  private readonly carConfigStore = inject(CarConfigStoreService);
  readonly selectedEquipments = this.carConfigStore.specialEquipment;
  readonly selectedCount = computed(() => {
    const ids = new Set(this.selectedEquipments().map(item => item.productId));
    return this.specialEquipmentListInit().filter(item => ids.has(item.productId)).length;
  });
  readonly selectionMessage = signal('');
  readonly maxSelection = 5;

  isSelected(item: SpecialEquipmentDto): boolean {
    return this.selectedEquipments().some(selected => selected.productId === item.productId);
  }

  onSelectItem(item: SpecialEquipmentDto): void {
    const id = item.productId;
    if (!id) return;

    const current = this.selectedEquipments();
    if (current.some(selected => selected.productId === id)) {
      this.carConfigStore.updateSpecialEquipment(current.filter(selected => selected.productId !== id));
      this.selectionMessage.set('');
      return;
    }

    if (current.length >= this.maxSelection) {
      this.selectionMessage.set('equipment.maxSelected');
      return;
    }

    if (item.categoryType !== SpecialEquipmentDto.CategoryTypeEnum.Misc
      && item.categoryType
      && current.some(selected => selected.categoryType === item.categoryType)) {
      this.selectionMessage.set('equipment.onePerCategory');
      return;
    }

    this.selectionMessage.set('');
    this.carConfigStore.updateSpecialEquipment([...current, item]);
  }
}
