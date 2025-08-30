import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigColorMenuSubComponent } from './car-config-color-menu-sub.component';

describe('CarConfigColorMenuSubComponent', () => {
  let component: CarConfigColorMenuSubComponent;
  let fixture: ComponentFixture<CarConfigColorMenuSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigColorMenuSubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigColorMenuSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
