import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigMain } from './car-config-main';

describe('CarConfigMain', () => {
  let component: CarConfigMain;
  let fixture: ComponentFixture<CarConfigMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
