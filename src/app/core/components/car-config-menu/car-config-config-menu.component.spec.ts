import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigConfigMenuComponent } from './car-config-config-menu.component';

describe('CarConfigConfigMenuComponent', () => {
  let component: CarConfigConfigMenuComponent;
  let fixture: ComponentFixture<CarConfigConfigMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigConfigMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigConfigMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
