import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigRim } from './car-config-rim';

describe('CarConfigRim', () => {
  let component: CarConfigRim;
  let fixture: ComponentFixture<CarConfigRim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigRim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigRim);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
