import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigHeaderComponent } from './car-config-header.component';

describe('CarConfigHeaderComponent', () => {
  let component: CarConfigHeaderComponent;
  let fixture: ComponentFixture<CarConfigHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
