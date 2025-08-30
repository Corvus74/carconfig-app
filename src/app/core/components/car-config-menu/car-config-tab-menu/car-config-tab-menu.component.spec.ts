import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigTabMenuComponent } from './car-config-tab-menu.component';

describe('CarConfigTabMenuComponent', () => {
  let component: CarConfigTabMenuComponent;
  let fixture: ComponentFixture<CarConfigTabMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigTabMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigTabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
