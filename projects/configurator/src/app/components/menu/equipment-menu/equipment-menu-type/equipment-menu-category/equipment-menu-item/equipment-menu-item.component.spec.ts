import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentMenuItemComponent } from './equipment-menu-item.component';

describe('EquipmentMenuItemComponent', () => {
  let component: EquipmentMenuItemComponent;
  let fixture: ComponentFixture<EquipmentMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentMenuItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
