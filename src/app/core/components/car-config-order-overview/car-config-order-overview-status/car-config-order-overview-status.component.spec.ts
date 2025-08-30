import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigOrderOverviewStatusComponent } from './car-config-order-overview-status.component';

describe('CarConfigOrderOverviewStatusComponent', () => {
  let component: CarConfigOrderOverviewStatusComponent;
  let fixture: ComponentFixture<CarConfigOrderOverviewStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigOrderOverviewStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigOrderOverviewStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
