import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigSpecialEquipmentMenuComponent } from './car-config-special-equipment-menu.component';

describe('CarConfigSpecialEquipmentMenuComponent', () => {
  let component: CarConfigSpecialEquipmentMenuComponent;
  let fixture: ComponentFixture<CarConfigSpecialEquipmentMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigSpecialEquipmentMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigSpecialEquipmentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
