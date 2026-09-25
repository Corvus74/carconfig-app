import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewStatusEquipmentComponent } from './overview-status.equipment.component';

describe('OverviewStatusEquipmentComponent', () => {
  let component: OverviewStatusEquipmentComponent;
  let fixture: ComponentFixture<OverviewStatusEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewStatusEquipmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewStatusEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
