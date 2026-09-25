import { Component, computed, input } from '@angular/core';
import { SpecialEquipmentDto } from '@carconfig/api-client';
import { EquipmentMenuCategoryComponent } from './equipment-menu-category/equipment-menu-category.component';
import { TranslocoModule } from '@jsverse/transloco';

interface EquipmentCategoryGroup {
  type: SpecialEquipmentDto.CategoryTypeEnum;
  title: string;
  items: SpecialEquipmentDto[];
}

@Component({
  selector: 'app-special-equipment-menu-type',
  imports: [EquipmentMenuCategoryComponent, TranslocoModule],
  templateUrl: './equipment-menu-type.component.html',
  styleUrl: './equipment-menu-type.component.scss',
})
export class EquipmentMenuTypeComponent {
  readonly specialEquipmentListInit = input<SpecialEquipmentDto[]>([]);
  readonly titleName = input<string>('');

  readonly categoryGroups = computed<EquipmentCategoryGroup[]>(() => {
    const items = this.specialEquipmentListInit();
    const categories: Array<{ type: SpecialEquipmentDto.CategoryTypeEnum; title: string }> = [
      { type: SpecialEquipmentDto.CategoryTypeEnum.AirCondition, title: 'equipment.airCondition' },
      { type: SpecialEquipmentDto.CategoryTypeEnum.Multimedia, title: 'equipment.multimedia' },
      { type: SpecialEquipmentDto.CategoryTypeEnum.Seats, title: 'equipment.seats' },
      { type: SpecialEquipmentDto.CategoryTypeEnum.Heating, title: 'equipment.heating' },
      { type: SpecialEquipmentDto.CategoryTypeEnum.NavigationSystem, title: 'equipment.navigation' },
      { type: SpecialEquipmentDto.CategoryTypeEnum.SteeringWheel, title: 'equipment.steeringWheel' },
      { type: SpecialEquipmentDto.CategoryTypeEnum.Misc, title: 'equipment.misc' },
    ];

    return categories
      .map(category => ({
        ...category,
        items: items.filter(item => item.categoryType === category.type),
      }))
      .filter(category => category.items.length > 0);
  });
}
