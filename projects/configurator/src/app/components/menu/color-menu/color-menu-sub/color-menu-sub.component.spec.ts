import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorMenuSubComponent } from './color-menu-sub.component';

describe('ColorMenuSubComponent', () => {
  let component: ColorMenuSubComponent;
  let fixture: ComponentFixture<ColorMenuSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorMenuSubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorMenuSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
