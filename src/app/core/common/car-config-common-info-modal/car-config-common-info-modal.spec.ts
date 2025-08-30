import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigCommonInfoModal } from './car-config-common-info-modal';

describe('CarConfigCommonInfoModal', () => {
  let component: CarConfigCommonInfoModal;
  let fixture: ComponentFixture<CarConfigCommonInfoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigCommonInfoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigCommonInfoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
