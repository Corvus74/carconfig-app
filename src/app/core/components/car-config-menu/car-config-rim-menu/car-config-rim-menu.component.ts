import { Component, ElementRef, input, output, ViewChild, inject } from '@angular/core';
import { CarRimDto } from '../../../api';
import { CarConfigRimMenuItemComponent } from './car-config-rim-menu-item/car-config-rim-menu-item.component';
import { CarConfigStoreService } from '../../../service/car-config-store.service';

@Component({
  selector: 'app-car-config-rim-menu',
  imports: [
    CarConfigRimMenuItemComponent
  ],
  templateUrl: './car-config-rim-menu.component.html',
  styleUrl: './car-config-rim-menu.component.scss'
})
export class CarConfigRimMenuComponent {
  readonly carRims = input<CarRimDto[] | undefined>(undefined);
  readonly selectedValue = input<CarRimDto | undefined>(undefined);
  @ViewChild('container') container: ElementRef | undefined;
  readonly selectionChange = output<void>();

  private readonly carConfigStoreService = inject(CarConfigStoreService);

  onItemSelected(value: CarRimDto): void {
    this.carConfigStoreService.updateRims(value);
    this.selectionChange.emit();
  }
}
