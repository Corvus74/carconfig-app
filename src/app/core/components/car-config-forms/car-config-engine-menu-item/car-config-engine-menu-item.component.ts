import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-car-config-engine-menu-item',
  imports: [],
  templateUrl: './car-config-engine-menu-item.component.html',
  styleUrl: './car-config-engine-menu-item.component.scss'
})
export class CarConfigEngineMenuItemComponent {
  @Input() title: string | undefined = '';
  @Input() description: string | undefined = '';
  @Input() value: any;
  @Input() isSelected: boolean = false;
  @Output() itemSelected = new EventEmitter<any>();

  onClick(): void {
    this.itemSelected.emit(this.value);
  }
}
