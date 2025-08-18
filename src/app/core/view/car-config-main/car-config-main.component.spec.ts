import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigMainComponent } from './car-config-main.component';

describe('CarConfigMainComponent', () => {
  let component: CarConfigMainComponent;
  let fixture: ComponentFixture<CarConfigMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
