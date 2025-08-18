import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigOrderComponent } from './car-config-order.component';

describe('CarConfigOrderComponent', () => {
  let component: CarConfigOrderComponent;
  let fixture: ComponentFixture<CarConfigOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
