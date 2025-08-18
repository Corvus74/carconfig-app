import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigUserInputComponent } from './car-config-user-input.component';

describe('CarConfigUserInputComponent', () => {
  let component: CarConfigUserInputComponent;
  let fixture: ComponentFixture<CarConfigUserInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigUserInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigUserInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
