import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigSidebar } from './car-config-sidebar';

describe('CarConfigSidebar', () => {
  let component: CarConfigSidebar;
  let fixture: ComponentFixture<CarConfigSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
