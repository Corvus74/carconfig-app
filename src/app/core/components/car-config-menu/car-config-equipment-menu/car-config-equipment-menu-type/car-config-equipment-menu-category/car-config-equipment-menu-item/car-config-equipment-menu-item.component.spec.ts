import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigEquipmentMenuItemComponent } from './car-config-equipment-menu-item.component';

describe('CarConfigEquipmentMenuItemComponent', () => {
  let component: CarConfigEquipmentMenuItemComponent;
  let fixture: ComponentFixture<CarConfigEquipmentMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigEquipmentMenuItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigEquipmentMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
