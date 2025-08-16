import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigOrder } from './car-config-order';

describe('CarConfigOrder', () => {
  let component: CarConfigOrder;
  let fixture: ComponentFixture<CarConfigOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
