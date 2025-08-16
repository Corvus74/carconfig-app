import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigEngine } from './car-config-engine';

describe('CarConfigEngine', () => {
  let component: CarConfigEngine;
  let fixture: ComponentFixture<CarConfigEngine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigEngine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigEngine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
