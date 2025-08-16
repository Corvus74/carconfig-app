import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigUserInput } from './car-config-user-input';

describe('CarConfigUserInput', () => {
  let component: CarConfigUserInput;
  let fixture: ComponentFixture<CarConfigUserInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigUserInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigUserInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
