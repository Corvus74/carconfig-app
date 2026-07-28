import { Component, input, output, OnInit, inject } from '@angular/core';
import { CarColorDto } from '../../../api';
import { CarConfigColorMenuSubComponent } from './car-color-config-menu-sub/car-config-color-menu-sub.component';
import { CarConfigStoreService } from '../../../service/car-config-store.service';

@Component({
  selector: 'app-car-config-color-menu',
  imports: [
    CarConfigColorMenuSubComponent
  ],
  templateUrl: './car-config-color-menu.component.html',
  styleUrl: './car-config-color-menu.component.scss'
})
export class CarConfigColorMenuComponent implements OnInit {
  readonly carColorInit = input<CarColorDto[] | undefined>(undefined);
  readonly selectedValue = input<CarColorDto | undefined>(undefined);
  readonly selectedMaterialType = input<CarColorDto.MaterialTypeEnum | undefined>(undefined);

  readonly selectionChange = output<CarColorDto>();

  carColorBase: CarColorDto[] = [];
  carColorGlossy: CarColorDto[] = [];
  carColorMatte: CarColorDto[] = [];
  CarColorDto = CarColorDto;
  carColorBaseTitleName: string = "Base Colors";
  carColorGlossyTitleName: string = "Metallic Colors";
  carColorMatteTitleName: string = "Matte Colors";

  private readonly carConfigStoreService = inject(CarConfigStoreService);

  ngOnInit(): void {
    this.createSubMenus();
  }

  forwardSelection(color: CarColorDto) {
    this.carConfigStoreService.updateColor(color);
    this.selectionChange.emit(color);
  }

  createSubMenus() {
    const initList = this.carColorInit();
    if (initList) {
      for (let carColor of initList) {
        if (carColor.paintingType === CarColorDto.PaintingTypeEnum.Base) {
          this.carColorBase.push(carColor);
          continue;
        }
        if (carColor.materialType === CarColorDto.MaterialTypeEnum.Glossy) {
          this.carColorGlossy.push(carColor);
        }
        if (carColor.materialType === CarColorDto.MaterialTypeEnum.Matte) {
          this.carColorMatte.push(carColor);
        }
      }
    }
  }
}
