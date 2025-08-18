import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigRimMenuComponent } from './car-config-rim-menu.component';

describe('CarConfigRimMenuComponent', () => {
  let component: CarConfigRimMenuComponent;
  let fixture: ComponentFixture<CarConfigRimMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigRimMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigRimMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
