import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigOrderOverviewComponent } from './car-config-order-overview.component';

describe('CarConfigOrderOverviewComponent', () => {
  let component: CarConfigOrderOverviewComponent;
  let fixture: ComponentFixture<CarConfigOrderOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigOrderOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigOrderOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
