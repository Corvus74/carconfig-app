import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigColorviewCircle } from './car-config-colorview-circle';

describe('CarConfigColorviewCircle', () => {
  let component: CarConfigColorviewCircle;
  let fixture: ComponentFixture<CarConfigColorviewCircle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigColorviewCircle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigColorviewCircle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
