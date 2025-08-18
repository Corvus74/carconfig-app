import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfigEngineMenuComponent } from './car-config-engine-menu.component';

describe('CarConfigEngineMenuComponent', () => {
  let component: CarConfigEngineMenuComponent;
  let fixture: ComponentFixture<CarConfigEngineMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfigEngineMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfigEngineMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
