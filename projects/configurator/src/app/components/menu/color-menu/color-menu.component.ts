import { Component, input, output, OnInit, inject } from '@angular/core';
import { CarColorDto } from  '@carconfig/api-client';
import { ColorMenuSubComponent } from './color-menu-sub/color-menu-sub.component';
import { CarConfigStoreService } from '@carconfig/car-state';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-color-menu',
  imports: [
    ColorMenuSubComponent,
    TranslocoModule
  ],
  templateUrl: './color-menu.component.html',
  styleUrl: './color-menu.component.scss'
})
export class ColorMenuComponent implements OnInit {
  readonly carColorInit = input<CarColorDto[] | undefined>(undefined);
  readonly selectedValue = input<CarColorDto | undefined>(undefined);
  readonly selectedMaterialType = input<CarColorDto.MaterialTypeEnum | undefined>(undefined);

  readonly selectionChange = output<CarColorDto>();

  carColorBase: CarColorDto[] = [];
  carColorGlossy: CarColorDto[] = [];
  carColorMatte: CarColorDto[] = [];
  CarColorDto = CarColorDto;
  carColorBaseTitleName = 'colors.solid';
  carColorGlossyTitleName = 'colors.metallic';
  carColorMatteTitleName = 'colors.matte';

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
