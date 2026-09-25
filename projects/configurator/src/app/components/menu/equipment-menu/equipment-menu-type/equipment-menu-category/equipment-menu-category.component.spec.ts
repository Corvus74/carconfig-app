import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { CarConfigStoreService } from '@carconfig/car-state';
import { SpecialEquipmentDto } from '@carconfig/api-client';

import { EquipmentMenuCategoryComponent } from './equipment-menu-category.component';

describe('EquipmentMenuCategoryComponent', () => {
  let component: EquipmentMenuCategoryComponent;
  let fixture: ComponentFixture<EquipmentMenuCategoryComponent>;
  let selected: WritableSignal<SpecialEquipmentDto[]>;
  let updateSpecialEquipment: jasmine.Spy;

  beforeEach(async () => {
    selected = signal<SpecialEquipmentDto[]>([]);
    updateSpecialEquipment = jasmine.createSpy('updateSpecialEquipment').and.callFake((items: SpecialEquipmentDto[]) => selected.set(items));
    const store = {
      specialEquipment: selected,
      updateSpecialEquipment,
    };

    await TestBed.configureTestingModule({
      imports: [EquipmentMenuCategoryComponent],
      providers: [{ provide: CarConfigStoreService, useValue: store }],
    })
    .overrideComponent(EquipmentMenuCategoryComponent, { set: { template: '' } })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentMenuCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds and removes selected equipment', () => {
    const item = equipment('seat-heat', SpecialEquipmentDto.CategoryTypeEnum.Heating);

    component.onSelectItem(item);
    expect(selected()).toEqual([item]);

    component.onSelectItem(item);
    expect(selected()).toEqual([]);
  });

  it('allows only one choice in a single-choice category', () => {
    const firstSeatOption = equipment('seat-heat', SpecialEquipmentDto.CategoryTypeEnum.Heating);
    const secondSeatOption = equipment('seat-vent', SpecialEquipmentDto.CategoryTypeEnum.Heating);
    component.onSelectItem(firstSeatOption);

    component.onSelectItem(secondSeatOption);

    expect(selected()).toEqual([firstSeatOption]);
    expect(component.selectionMessage()).toBe('equipment.onePerCategory');
  });

  it('limits the whole configuration to five equipment items', () => {
    const existingItems = Array.from({ length: 5 }, (_, index) => equipment(`eq-${index}`, SpecialEquipmentDto.CategoryTypeEnum.Misc));
    selected.set(existingItems);

    component.onSelectItem(equipment('eq-six', SpecialEquipmentDto.CategoryTypeEnum.Misc));

    expect(selected()).toEqual(existingItems);
    expect(component.selectionMessage()).toBe('equipment.maxSelected');
  });
});

function equipment(productId: string, categoryType: SpecialEquipmentDto.CategoryTypeEnum): SpecialEquipmentDto {
  return { productId, categoryType } as SpecialEquipmentDto;
}
