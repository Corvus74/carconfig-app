import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigColor } from './car-config-color';

describe('CarConfigColor', () => {
  let component: CarConfigColor;
  let fixture: ComponentFixture<CarConfigColor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigColor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigColor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
