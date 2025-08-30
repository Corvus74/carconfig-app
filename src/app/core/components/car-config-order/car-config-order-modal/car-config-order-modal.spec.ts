import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigOrderModal } from './car-config-order-modal';

describe('CarConfigOrderModal', () => {
  let component: CarConfigOrderModal;
  let fixture: ComponentFixture<CarConfigOrderModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigOrderModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigOrderModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
