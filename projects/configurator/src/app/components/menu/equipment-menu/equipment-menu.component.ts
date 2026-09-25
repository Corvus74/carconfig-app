import { Component, computed, input } from '@angular/core';
import { SpecialEquipmentDto } from '@carconfig/api-client';
import { TranslocoModule } from '@jsverse/transloco';
import { EquipmentMenuTypeComponent } from './equipment-menu-type/equipment-menu-type.component';

@Component({
  selector: 'app-special-equipment-menu',
  imports: [EquipmentMenuTypeComponent, TranslocoModule],
  templateUrl: './equipment-menu.component.html',
  styleUrl: './equipment-menu.component.scss',
})
export class EquipmentMenuComponent {
  readonly specialEquipmentListInit = input<SpecialEquipmentDto[] | undefined>(undefined);
  readonly specialEquipmentInteriorList = computed(() => this.byLocation(SpecialEquipmentDto.EquipmentLocationEnum.Interior));
  readonly specialEquipmentExteriorList = computed(() => this.byLocation(SpecialEquipmentDto.EquipmentLocationEnum.Exterior));

  private byLocation(location: SpecialEquipmentDto.EquipmentLocationEnum): SpecialEquipmentDto[] {
    return this.specialEquipmentListInit()?.filter(item => item.equipmentLocation === location) ?? [];
  }
}
