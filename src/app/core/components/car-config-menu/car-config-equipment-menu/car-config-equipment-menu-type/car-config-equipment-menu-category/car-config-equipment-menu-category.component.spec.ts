import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigEquipmentMenuCategoryComponent } from './car-config-equipment-menu-category.component';

describe('CarConfigEquipmentMenuCategoryComponent', () => {
  let component: CarConfigEquipmentMenuCategoryComponent;
  let fixture: ComponentFixture<CarConfigEquipmentMenuCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigEquipmentMenuCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigEquipmentMenuCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
