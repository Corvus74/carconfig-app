import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentMenuTypeComponent } from './equipment-menu-type.component';

describe('EquipmentMenuTypeComponent', () => {
  let component: EquipmentMenuTypeComponent;
  let fixture: ComponentFixture<EquipmentMenuTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentMenuTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentMenuTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
