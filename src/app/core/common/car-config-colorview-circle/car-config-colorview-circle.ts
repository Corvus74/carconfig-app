import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgStyle} from '@angular/common';
import {CarColorDto} from '../../api';

@Component({
  selector: 'app-car-config-colorview-circle',
  imports: [
    NgStyle
  ],
  templateUrl: './car-config-colorview-circle.html',
  styleUrl: './car-config-colorview-circle.scss'
})
export class CarConfigColorviewCircle  implements OnChanges {
  @Input() fillColor: string = 'gray';
  @Input() materialType: CarColorDto.MaterialTypeEnum | undefined= CarColorDto.MaterialTypeEnum.Matte;

  circleStyle: { [key: string]: string } = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fillColor'] || changes['materialType']) {
      this.updateCircleStyle();
    }
  }

  private updateCircleStyle(): void {
    const isGlossy = this.materialType === CarColorDto.MaterialTypeEnum.Glossy;

    // Base styles
    this.circleStyle = {
      'background-color': this.fillColor,
      'box-shadow': 'none',
      'border': '2px solid #ccc'
    };

    if (isGlossy) {
      this.circleStyle = {
        ...this.circleStyle,
        // The glossy effect is created using multiple box-shadows to mimic reflections
        'box-shadow': `
          inset 0 0 15px rgba(255, 255, 255, 0.6),
          inset 0 0 10px rgba(255, 255, 255, 0.4),
          inset 0 0 5px rgba(255, 255, 255, 0.2),
          0 0 5px rgba(0, 0, 0, 0.2)`
      };
    } else { // Matte effect
      this.circleStyle = {
        ...this.circleStyle,
        // A simple, soft shadow for a non-reflective, matte appearance
        'box-shadow': `0 4px 6px rgba(0, 0, 0, 0.3)`
      };
    }
  }
}
