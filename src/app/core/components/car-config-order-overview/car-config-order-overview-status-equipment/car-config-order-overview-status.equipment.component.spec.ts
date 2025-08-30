import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigOrderOverviewStatusEquipmentComponent } from './car-config-order-overview-status.equipment.component';

describe('CarConfigOrderOverviewStatusEquipmentComponent', () => {
  let component: CarConfigOrderOverviewStatusEquipmentComponent;
  let fixture: ComponentFixture<CarConfigOrderOverviewStatusEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigOrderOverviewStatusEquipmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigOrderOverviewStatusEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
