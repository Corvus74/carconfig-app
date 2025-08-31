import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {CarConfigChangeService} from '../../../../../service/car-config-change.service';
import {Subscription} from 'rxjs';
import {SpecialEquipmentDto} from '../../../../../api';
import {
  CarConfigEquipmentMenuItemComponent
} from './car-config-equipment-menu-item/car-config-equipment-menu-item.component';

@Component({
  selector: 'app-car-config-equipment-menu-category',
  imports: [
    CarConfigEquipmentMenuItemComponent
  ],
  templateUrl: './car-config-equipment-menu-category.component.html',
  styleUrl: './car-config-equipment-menu-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarConfigEquipmentMenuCategoryComponent implements OnInit, OnDestroy {
  @Input() titleName!: string;
  @Input() specialEquipmentListInit: SpecialEquipmentDto[] = [];
  @ViewChild('container') container: ElementRef | undefined;
  carSpecialEquipmentSubscription: Subscription | undefined;
  selectedEquipments: SpecialEquipmentDto[] = [];
  maxSelection = 5;
  selectedIds = signal<Set<string>>(new Set());
  selectedCategories = signal<Set<SpecialEquipmentDto.CategoryTypeEnum>>(new Set());
  categoryMenuShown: boolean=false;
  constructor(private readonly carConfigChangeService: CarConfigChangeService) {
  }

  showCategoryMenu() {
    this.categoryMenuShown = !this.categoryMenuShown;
  }
  ngOnDestroy(): void {
    this.carSpecialEquipmentSubscription?.unsubscribe();
  }


  ngOnInit(): void {
    this.carSpecialEquipmentSubscription = this.carConfigChangeService.specialEquipmentData$.subscribe(
      (data) => {
        // Sanitize: entferne undefined/leer und Items ohne productId
        const sanitized = (data ?? []).filter(
          (e): e is SpecialEquipmentDto => !!e && !!e.productId
        );

        this.selectedEquipments = sanitized;
        this.selectedIds.set(new Set());
        this.selectedIds.update(emptyItems => {
            const toBeUpdatedItems = new Set(emptyItems);
            for (const e of sanitized) {
              // productId ist hier garantiert vorhanden
              toBeUpdatedItems.add(e.productId!);
            }

            return toBeUpdatedItems;
          }
        )
      }
    );
  }

  onSelectItem(item: SpecialEquipmentDto): void {
    const id = item?.productId;
    if (!id) {
      return; // Ignoriere Items ohne ID
    }
    this.selectedIds.update(currentItems => {
      const newItemsToModify = new Set(currentItems);

      if (newItemsToModify.has(id)) {
        // Deselektieren
        newItemsToModify.delete(id);
        this.selectedEquipments = this.selectedEquipments.filter(e => e.productId !== id);
      } else {
        // Selektieren mit Limit
        if (this.selectedEquipments.length < this.maxSelection) {
          if (!this.simpleCheckForCategory(item)) {
            newItemsToModify.add(id);
            this.selectedEquipments = [...this.selectedEquipments, item];
          }
        } else {
          console.log(`Maximum of ${this.maxSelection} items can be selected.`);
        }
      }
      return newItemsToModify;
    });

    this.carConfigChangeService.updateSpecialEquipmentData(this.selectedEquipments);
  }

  isSelectedAndNotDoubleByCategory(item: SpecialEquipmentDto): boolean {
    const id = item?.productId;
    return !!id && this.selectedIds().has(id);
  }

  scroll(direction: 'left' | 'right') {
    if (this.container) {
      const container = this.container.nativeElement as HTMLElement;
      const scrollAmount = 200; // Anpassbar

      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  }

  simpleCheckForCategory(item: SpecialEquipmentDto) {
    if (item.categoryType === SpecialEquipmentDto.CategoryTypeEnum.Misc) {
      return false;
    }
    let setOfCategory = new Set<SpecialEquipmentDto.CategoryTypeEnum>();

    for (const selectedItem of this.selectedEquipments) {
      const category = selectedItem.categoryType;
      if (category) {
        setOfCategory.add(category);
      }
    }
    const categoryItem = item.categoryType;
    if (categoryItem) {
      return setOfCategory.has(categoryItem);
    }
    return false
  }


}
