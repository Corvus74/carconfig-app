import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarConfig3dCarViewComponent } from './car-config-3d-car-view.component';

describe('CarConfig3dCarViewComponent', () => {
  let component: CarConfig3dCarViewComponent;
  let fixture: ComponentFixture<CarConfig3dCarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarConfig3dCarViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarConfig3dCarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
