import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigEquipmentMenuTypeComponent } from './car-config-equipment-menu-type.component';

describe('CarConfigEquipmentMenuTypeComponent', () => {
  let component: CarConfigEquipmentMenuTypeComponent;
  let fixture: ComponentFixture<CarConfigEquipmentMenuTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigEquipmentMenuTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigEquipmentMenuTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
