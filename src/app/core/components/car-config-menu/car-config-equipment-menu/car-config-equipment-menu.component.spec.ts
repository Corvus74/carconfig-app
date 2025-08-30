import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigEquipmentMenuComponent } from './car-config-equipment-menu.component';

describe('CarConfigEquipmentMenuComponent', () => {
  let component: CarConfigEquipmentMenuComponent;
  let fixture: ComponentFixture<CarConfigEquipmentMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigEquipmentMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigEquipmentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
