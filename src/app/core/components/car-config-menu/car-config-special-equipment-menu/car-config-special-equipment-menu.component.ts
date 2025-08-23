import {Component, Input} from '@angular/core';
import {SpecialEquipmentDto} from '../../../api';
import {CarConfigChangeService} from '../../../service/car-config-change.service';
import {formatCurrency} from '@angular/common';

@Component({
  selector: 'app-car-config-special-equipment-menu',
  imports: [],
  templateUrl: './car-config-special-equipment-menu.component.html',
  styleUrl: './car-config-special-equipment-menu.component.scss'
})
export class CarConfigSpecialEquipmentMenuComponent {
  @Input() specialEquipment: SpecialEquipmentDto[] | undefined

  constructor(private readonly carConfigChangeService:CarConfigChangeService) {
  }


  selectedItems: SpecialEquipmentDto[] = [];
  maxSelection = 5;

  onSelect(item: SpecialEquipmentDto): void {
    const index = this.selectedItems.indexOf(item);

    if (index > -1) {
      // Item is already selected, so unselect it
      this.selectedItems.splice(index, 1);
    } else {
      // Item is not selected, add it if the limit hasn't been reached
      if (this.selectedItems.length < this.maxSelection) {
        this.selectedItems.push(item);
      } else {
        // Optionally, alert the user or handle the full state
        console.log(`Maximum of ${this.maxSelection} items can be selected.`);
      }
    }
    this.carConfigChangeService.updateSpecialEquipmentData(this.selectedItems);
  }
  isSelected(item: SpecialEquipmentDto): boolean {
    return this.selectedItems.indexOf(item) > -1;
  }
  toCurrencyFormat(price: number | undefined) {
    if (price) {
      return formatCurrency(price/100,"de-DE","€","EUR")
    }
    return ""
  }

  protected readonly formatCurrency = formatCurrency;
}
