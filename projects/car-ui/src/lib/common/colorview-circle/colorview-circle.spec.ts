import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorviewCircle } from './colorview-circle';

describe('ColorviewCircle', () => {
  let component: ColorviewCircle;
  let fixture: ComponentFixture<ColorviewCircle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorviewCircle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorviewCircle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
