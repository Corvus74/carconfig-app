import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigColorMenuComponent } from './car-config-color-menu.component';

describe('CarConfigColorMenuComponent', () => {
  let component: CarConfigColorMenuComponent;
  let fixture: ComponentFixture<CarConfigColorMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigColorMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigColorMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
