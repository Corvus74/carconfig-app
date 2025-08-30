import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigOrderViewComponent } from './car-config-order-view.component';

describe('CarConfigOrderViewComponent', () => {
  let component: CarConfigOrderViewComponent;
  let fixture: ComponentFixture<CarConfigOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigOrderViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
