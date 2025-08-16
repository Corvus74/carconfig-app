import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigHeader } from './car-config-header';

describe('CarConfigHeader', () => {
  let component: CarConfigHeader;
  let fixture: ComponentFixture<CarConfigHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
