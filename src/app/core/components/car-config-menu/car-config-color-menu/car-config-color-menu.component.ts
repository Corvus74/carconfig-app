import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {CarColorDto} from '../../../api';
import {CarConfigColorMenuSubComponent} from './car-color-config-menu-sub/car-config-color-menu-sub.component';

@Component({
  selector: 'app-car-config-color-menu',
  imports: [
    CarConfigColorMenuSubComponent
  ],
  templateUrl: './car-config-color-menu.component.html',
  styleUrl: './car-config-color-menu.component.scss'
})
export class CarConfigColorMenuComponent implements OnInit {
  @Input() carColorInit: CarColorDto[] | undefined
  @Input() selectedValue: CarColorDto | undefined;
  @Input() selectedMaterialType: CarColorDto.MaterialTypeEnum | undefined;

  carColorBase: CarColorDto[] = []
  carColorGlossy: CarColorDto[] = [];
  carColorMatte: CarColorDto[] = [];
  CarColorDto = CarColorDto;
  carColorBaseTitleName: string = "Base Colors";
  carColorGlossyTitleName: string = "Metallic Colors";
  carColorMatteTitleName: string = "Matte Colors";

  constructor() {
  }
  @Output() selectionChange = new EventEmitter<unknown>();

  ngOnInit(): void {
    this.createSubMenus()
  }

  createSubMenus() {
    if (this.carColorInit) {
      for (let carColor of this.carColorInit) {
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

