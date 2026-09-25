import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentMenuCategoryComponent } from './equipment-menu-category.component';

describe('EquipmentMenuCategoryComponent', () => {
  let component: EquipmentMenuCategoryComponent;
  let fixture: ComponentFixture<EquipmentMenuCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentMenuCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentMenuCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
