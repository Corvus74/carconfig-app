import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigSpecialEquipment } from './car-config-special-equipment';

describe('CarConfigSpecialEquipment', () => {
  let component: CarConfigSpecialEquipment;
  let fixture: ComponentFixture<CarConfigSpecialEquipment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigSpecialEquipment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigSpecialEquipment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
