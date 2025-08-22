import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigCarInformationComponent } from './car-config-car-information.component';

describe('CarConfigCarInformationComponent', () => {
  let component: CarConfigCarInformationComponent;
  let fixture: ComponentFixture<CarConfigCarInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigCarInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigCarInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
